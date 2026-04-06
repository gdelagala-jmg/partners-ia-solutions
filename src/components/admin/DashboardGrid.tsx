'use client'

import React, { useState, useEffect } from 'react'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
} from '@dnd-kit/sortable'
import { DashboardModule } from './DashboardModule'

interface Module {
    id: string
    title: string
    component: React.ReactNode
    className?: string
}

interface DashboardGridProps {
    initialModules: Module[]
    isEditing: boolean
    onOrderChange?: (newOrder: string[]) => void
}

export function DashboardGrid({ initialModules, isEditing, onOrderChange }: DashboardGridProps) {
    const [modules, setModules] = useState<Module[]>(initialModules)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Sensibilidad mínima para evitar disparos accidentales
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event

        if (over && active.id !== over.id) {
            setModules((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id)
                const newIndex = items.findIndex((i) => i.id === over.id)
                const newOrder = arrayMove(items, oldIndex, newIndex)
                
                if (onOrderChange) {
                    onOrderChange(newOrder.map(m => m.id))
                }
                
                return newOrder
            })
        }
    }

    // Adapt grid based on screen width - Responsive Apple-style Grid
    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={modules.map((m) => m.id)}
                strategy={rectSortingStrategy}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in duration-700">
                    {modules.map((module) => (
                        <DashboardModule
                            key={module.id}
                            id={module.id}
                            title={module.title}
                            isEditing={isEditing}
                            className={module.className}
                        >
                            {module.component}
                        </DashboardModule>
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    )
}
