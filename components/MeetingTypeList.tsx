'use client'

import { useState } from "react"
import MeetingCard from "./MeetingCard"
import { useRouter } from "next/navigation";
import MeetingModal from "./MeetingModal";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useToast } from "./ui/use-toast";


const MeetingTypeList = () => {

    const router = useRouter();
    const { toast } = useToast();

    const [meetingType, setMeetingType] = useState<'isSchedule' | 'isJoining' | 'isInstant' | undefined>();
    const { user } = useUser();
    const client = useStreamVideoClient();
    const [values, setValues] = useState({
        dateTime: new Date(),
        description: '',
        link: '',
    });

    const [callDetail, setCallDetail] = useState<Call>();

    const createMeeting = async () => {
        if (!client || !user) return;

        try {

            if(!values.dateTime) {
                toast({title: "Failed to start meeting"});
                return;
            }

            const id = crypto.randomUUID();
            const call = client.call('default', id);

            if(!call) throw new Error('Failed to create meeting');

            const startAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
            const description = values.description || 'Instant Meeting';
            
            await call.getOrCreate({
                data: {
                    starts_at: startAt,
                    custom: {
                        description
                    }
                }
            });

            setCallDetail(call);

            if(!values.description){
                router.push(`/meeting/${call.id}`);
            }

            toast({title: "Meeting Started"});
        }
        catch (err) {
            console.log(err);
            toast({
                title: 'Fail to start meeting'
            })
        }
    };

    return (
        <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
            <MeetingCard
                className="bg-orange-1"
                img="/icons/add-meeting.svg"
                title="New Meeting"
                description="Start an instant meeting"
                handleClick={() => setMeetingType('isInstant')}
            />

            <MeetingCard
                className="bg-blue-1"
                img="/icons/schedule.svg"
                title="Schedule Meeting"
                description="Plan your meeting"
                handleClick={() => setMeetingType('isSchedule')}
            />

            <MeetingCard
                className="bg-purple-1"
                img="/icons/join-meeting.svg"
                title="Join Meeting"
                description="via invitation link"
                handleClick={() => setMeetingType('isJoining')}
            />

            <MeetingCard
                className="bg-yellow-1"
                img="/icons/recordings.svg"
                title="View Recordings"
                description="Check out your recordings"
                handleClick={() => router.push('/recordings')}
            />

            <MeetingModal
                isOpen={meetingType === 'isInstant'}
                onClose={() => setMeetingType(undefined)}
                title="Start an instant meeting"
                className="text-center"
                buttonText="Start Meeting"
                handleClick={createMeeting}
            />
        </section>
    )
}

export default MeetingTypeList