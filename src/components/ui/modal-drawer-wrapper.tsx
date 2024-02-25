"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/lib/hooks/use-media-query"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

interface BaseProps {
  children: React.ReactNode
}

interface RootModalDrawerProps extends BaseProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

interface ModalDrawerProps extends BaseProps {
  className?: string
  asChild?: true
}

const desktop = "(min-width: 768px)"

const ModalDrawer = ({ children, ...props }: RootModalDrawerProps) => {
  const isDesktop = useMediaQuery(desktop)
  const ModalDrawer = isDesktop ? Dialog : Drawer

  return <ModalDrawer {...props}>{children}</ModalDrawer>
}

const ModalDrawerTrigger = ({ className, children, ...props }: ModalDrawerProps) => {
  const isDesktop = useMediaQuery(desktop)
  const ModalDrawerTrigger = isDesktop ? DialogTrigger : DrawerTrigger

  return (
    <ModalDrawerTrigger className={className} {...props}>
      {children}
    </ModalDrawerTrigger>
  )
}

const ModalDrawerClose = ({ className, children, ...props }: ModalDrawerProps) => {
  const isDesktop = useMediaQuery(desktop)
  const ModalDrawerClose = isDesktop ? DialogClose : DrawerClose

  return (
    <ModalDrawerClose className={className} {...props}>
      {children}
    </ModalDrawerClose>
  )
}

const ModalDrawerContent = ({ className, children, ...props }: ModalDrawerProps) => {
  const isDesktop = useMediaQuery(desktop)
  const ModalDrawerContent = isDesktop ? DialogContent : DrawerContent

  return (
    <ModalDrawerContent className={className} {...props}>
      {children}
    </ModalDrawerContent>
  )
}

const ModalDrawerDescription = ({
  className,
  children,
  ...props
}: ModalDrawerProps) => {
  const isDesktop = useMediaQuery(desktop)
  const ModalDrawerDescription = isDesktop ? DialogDescription : DrawerDescription

  return (
    <ModalDrawerDescription className={className} {...props}>
      {children}
    </ModalDrawerDescription>
  )
}

const ModalDrawerHeader = ({ className, children, ...props }: ModalDrawerProps) => {
  const isDesktop = useMediaQuery(desktop)
  const ModalDrawerHeader = isDesktop ? DialogHeader : DrawerHeader

  return (
    <ModalDrawerHeader className={className} {...props}>
      {children}
    </ModalDrawerHeader>
  )
}

const ModalDrawerTitle = ({ className, children, ...props }: ModalDrawerProps) => {
  const isDesktop = useMediaQuery(desktop)
  const ModalDrawerTitle = isDesktop ? DialogTitle : DrawerTitle

  return (
    <ModalDrawerTitle className={className} {...props}>
      {children}
    </ModalDrawerTitle>
  )
}

const ModalDrawerBody = ({ className, children, ...props }: ModalDrawerProps) => {
  return (
    <div className={cn("px-4 md:px-0", className)} {...props}>
      {children}
    </div>
  )
}

const ModalDrawerFooter = ({ className, children, ...props }: ModalDrawerProps) => {
  const isDesktop = useMediaQuery(desktop)
  const ModalDrawerFooter = isDesktop ? DialogFooter : DrawerFooter

  return (
    <ModalDrawerFooter className={className} {...props}>
      {children}
    </ModalDrawerFooter>
  )
}

export {
  ModalDrawer,
  ModalDrawerTrigger,
  ModalDrawerClose,
  ModalDrawerContent,
  ModalDrawerDescription,
  ModalDrawerHeader,
  ModalDrawerTitle,
  ModalDrawerBody,
  ModalDrawerFooter,
}