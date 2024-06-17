'use client';

import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk'
import React from 'react'
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

const EndButton = () => {

    const call = useCall();
    const { useLocalParticipant } = useCallStateHooks();
    const localParticipant = useLocalParticipant();
    const router = useRouter();

    const isMeetingOwner = localParticipant && call?.state.createdBy && localParticipant.userId === call.state.createdBy.id;

    if(!isMeetingOwner) return null;

    return (
        <Button onClick={async () => {
            call?.camera.disable();
            call?.microphone.disable();
            await call.endCall();
            router.push('/');
        }} className='bg-red-500'>
            End Meeting for all
        </Button>
    )
}

export default EndButton