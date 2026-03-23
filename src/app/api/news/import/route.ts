import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateSlug } from '@/lib/utils'
import AdmZip from 'adm-zip'
import path from 'path'
import fs from 'fs'

export async function POST(request: Request) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
        }

        const buffer = Buffer.from(await file.arrayBuffer())
        const fileName = file.name.toLowerCase()

        let posts: any[] = []
        let zipEntries: any[] = []

        // Detect file type and process accordingly
        if (fileName.endsWith('.zip')) {
            // Process ZIP file (original logic)
            const zip = new AdmZip(buffer)
            zipEntries = zip.getEntries()

            const datEntry = zipEntries.find((entry: any) => entry.entryName.endsWith('.dat'))
            if (!datEntry) {
                return NextResponse.json({ error: 'Metadata (.dat) file not found in ZIP' }, { status: 400 })
            }

            const datContent = datEntry.getData().toString('utf8')
            try {
                posts = JSON.parse(datContent)
            } catch (e) {
                console.error('Error parsing .dat JSON from ZIP:', e)
                fs.writeFileSync(path.join(process.cwd(), 'debug_dat_content.txt'), datContent)
                return NextResponse.json({ error: 'Invalid metadata format. Expected JSON in .dat file.' }, { status: 400 })
            }
        } else if (fileName.endsWith('.dat') || fileName.endsWith('.json')) {
            // Process single .dat or .json file
            const datContent = buffer.toString('utf8')
            try {
                const parsedData = JSON.parse(datContent)
                // Support both single object and array format
                posts = Array.isArray(parsedData) ? parsedData : [parsedData]
            } catch (e) {
                console.error('Error parsing individual file JSON:', e)
                fs.writeFileSync(path.join(process.cwd(), 'debug_dat_content.txt'), datContent)
                return NextResponse.json({ error: 'Invalid file format. Expected JSON.' }, { status: 400 })
            }
        } else {
            return NextResponse.json({ error: 'Invalid file type. Please upload a .zip, .dat or .json file.' }, { status: 400 })
        }

        if (!Array.isArray(posts)) {
            return NextResponse.json({ error: 'Metadata must be an array of posts or a single post object' }, { status: 400 })
        }

        const uploadDir = path.join(process.cwd(), 'public', 'uploads')
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true })
        }

        const results = {
            success: 0,
            skipped: 0,
            errors: [] as string[]
        }

        for (const post of posts) {
            try {
                // Handle image if present in ZIP
                let coverImageUrl = post.coverImage || null

                if (post.imageFilename && zipEntries.length > 0) {
                    const imageEntry = zipEntries.find((entry: any) => entry.entryName.includes(post.imageFilename))
                    if (imageEntry) {
                        const targetPath = path.join(uploadDir, post.imageFilename)
                        fs.writeFileSync(targetPath, imageEntry.getData())
                        coverImageUrl = `/uploads/${post.imageFilename}`
                    }
                }

                // Generate slug if missing to ensure existence check works
                const targetSlug = post.slug || (post.title ? generateSlug(post.title) : undefined)

                if (!targetSlug) {
                    results.errors.push(`Error in post "${post.title || 'Sin título'}": No se pudo generar un slug válido`)
                    continue
                }

                // Check if already exists by slug
                const existing = await prisma.newsPost.findUnique({
                    where: { slug: targetSlug }
                })

                if (existing) {
                    results.skipped++
                    continue
                }

                await prisma.newsPost.create({
                    data: {
                        title: post.title,
                        slug: targetSlug,
                        category: post.category || 'Noticia',
                        aiType: post.aiType || null,
                        businessArea: post.businessArea || null,
                        sector: post.sector || null,
                        profession: post.profession || null,
                        aiTool: post.aiTool || null,
                        content: post.content || '',
                        coverImage: coverImageUrl,
                        published: post.published !== undefined ? post.published : false,
                        publishedAt: post.published ? new Date() : null,
                    }
                })
                results.success++
            } catch (postError: any) {
                console.error('Error importing post:', postError)
                results.errors.push(`Error in post "${post.title}": ${postError.message}`)
            }
        }

        return NextResponse.json({
            message: 'Import completed',
            results
        })

    } catch (error: any) {
        console.error('Import error:', error)
        return NextResponse.json({ error: 'Import failed: ' + error.message }, { status: 500 })
    }
}
