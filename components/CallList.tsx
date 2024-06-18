'use client';

// @ts-ignore
import { useGetCalls } from '@/hooks/useGetCalls';
import { Call, CallRecording } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import CallCard from './CallCard';
import { Loader } from 'lucide-react';
import { useToast } from './ui/use-toast';

interface CallListProps {
    type: 'ended' | 'upcoming' | 'recordings';
}
const CallList = (
    { type }: CallListProps
) => {

    const router = useRouter();
    const { toast } = useToast();
    const { endedCalls, upcomingCalls, callRecords, isLoading } = useGetCalls();
    const [recordings, setRecordings] = useState<CallRecording[]>([]);

    const getCalls = () => {
        switch (type) {
            case 'ended':
                return endedCalls;
            case 'upcoming':
                return upcomingCalls;
            case 'recordings':
                return recordings;
            default:
                return [];
        }
    }

    const getNoCallsMessage = () => {
        switch (type) {
            case 'ended':
                return 'No Previous Calls';
            case 'recordings':
                return 'No Recordings';
            case 'upcoming':
                return 'No Upcoming Calls';
            default:
                return [];
        }
    }

    useEffect(() => {
        const fetchRecordings = async () => {
            try{
                const callData = await Promise.all(callRecords.map((meeting) => meeting.queryRecordings()));

                const recordings = callData
                    .filter(call => call.recordings.length > 0)
                    .flatMap(call => call.recordings);
    
                setRecordings(recordings);
            }
            catch(err){
                toast({ title: 'Try again Later'});
            }
        }

        fetchRecordings();
    }, [type, callRecords]);

    const calls = getCalls();
    const noCallsMessage = getNoCallsMessage();

    if (isLoading) return <Loader />

    return (
        <div className='grid grid-cols-1 gap-5 xl:grid-cols-2'>
            {calls && calls.length > 0 ? calls.map((meeting: Call | CallRecording) => (
                <CallCard
                    key={(meeting as Call).id}
                    icon={
                        type === 'ended'
                            ? '/icons/previous.svg'
                            : type === 'upcoming'
                                ? '/icons/upcoming.svg'
                                : '/icons/recordings.svg'
                    }
                    title={(meeting as Call).state?.custom?.description?.substring(0, 20)
                        || (meeting as CallRecording)?.filename?.substring(0,20) || 'Personal Meeting'}
                    date={meeting?.startsAt?.toLocaleString() || meeting?.start_time.toLocaleString()}
                    isPreviousMeeting={type === 'ended'}
                    buttonIcon1={type === 'recordings' ? '/icons/play.svg' : undefined}
                    handleClick={type === 'recordings' ?
                        () => router.push(meeting.url) :
                        () => router.push(`/meeting/${meeting.id}`)}
                    link={type === 'recordings' ? meeting.url : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.id}`}
                    buttonText={type === 'recordings' ? 'Play' : 'Start'}
                />
            )) :
                (
                    <h1>{noCallsMessage}</h1>
                )
            }
        </div>
    )
}

export default CallList
