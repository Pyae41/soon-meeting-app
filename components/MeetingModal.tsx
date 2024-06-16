import React, { ReactNode } from 'react'
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';


interface MeetingModalProps {
    className?: string;
    children?: ReactNode;
    image?: string;
    buttonIcon?: string;
    title: string;
    buttonText: string;
    isOpen: boolean;
    onClose: () => void;
    handleClick: () => void;
}

const MeetingModal = (
    {
        className,
        children,
        image,
        title,
        buttonIcon,
        buttonText,
        isOpen,
        onClose,
        handleClick

    }: MeetingModalProps
) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='flex w-full max-w-[520px] flex-col gap-6 border-none bg-dark-1 px-6 py-9 text-white focus:border-none'>
                <div className="flex flex-col gap-5">
                    {image && (
                        <div className='flex justify-center'>
                            <Image
                                src={image}
                                alt={image}
                                width={72}
                                height={72}
                            />
                        </div>
                    )}
                    <h1 className={cn(`text-bold font-bold leading-[42px]`, className)}>{title}</h1>
                    {children}

                    <Button className='bg-blue-1 
                    focus-visible:ring-0 focus-visible:ring-offset-0'
                        onClick={handleClick}
                    >
                        {buttonIcon && (
                            <Image
                                src={buttonIcon}
                                alt="button icon"
                                width={13}
                                height={13}
                            />
                        )} &nbsp;
                        {buttonText}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default MeetingModal