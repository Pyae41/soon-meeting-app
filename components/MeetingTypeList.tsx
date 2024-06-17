import { useState } from "react"
import MeetingCard from "./MeetingCard"
import { useRouter } from "next/navigation";
import MeetingModal from "./MeetingModal";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useToast } from "./ui/use-toast";
import { Textarea } from "./ui/textarea";
import ReactDatePicker from 'react-datepicker';


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

    const [callDetails, setCallDetails] = useState<Call>();

    const createMeeting = async () => {
        if (!client || !user) return;

        try {

            if (!values.dateTime) {
                toast({ title: "Failed to start meeting" });
                return;
            }

            const id = crypto.randomUUID();
            const call = client.call('default', id);

            if (!call) throw new Error('Failed to create meeting');

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

            setCallDetails(call);

            if (!values.description && meetingType !== 'isSchedule') {
                router.push(`/meeting/${call.id}`);
            }

            toast({ title: "Meeting Created" });
        }
        catch (err) {
            console.log(err);
            toast({
                title: 'Fail to start meeting'
            })
        }
    };

    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`;

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

            {!callDetails ?
                (
                    <MeetingModal
                        isOpen={meetingType === 'isSchedule'}
                        onClose={() => setMeetingType(undefined)}
                        title="Create Meeting"
                        buttonText="Schedule Meeting"
                        handleClick={createMeeting}
                    >
                        <div className="flex flex-col gap-2.5">
                            <label htmlFor="" className="text-base text-normal leading-[22px] text-sky-2">
                                Add a Description
                            </label>
                            <Textarea
                                className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                                onChange={(e) => {
                                    setValues({ ...values, description: e.target.value })
                                }}
                            />

                            <label htmlFor="" className="text-base text-normal leading-[22px] text-sky-2">
                                Select date and time
                            </label>
                            <ReactDatePicker 
                                selected={values.dateTime}
                                onChange={(date) => setValues({...values,dateTime: date!})}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                timeCaption="time"
                                dateFormat="MMMM d, yyyy h:mm aa"
                                className="w-full rounded bg-dark-3 p-2"
                            />
                        </div>
                    </MeetingModal>
                ) :
                (
                    <MeetingModal
                        isOpen={meetingType === 'isSchedule'}
                        onClose={() => setMeetingType(undefined)}
                        title="Meeting Created"
                        className="text-center"
                        image="/icons/checked.svg"
                        buttonIcon="/icons/copy.svg"
                        buttonText="Copy Meeting Link"
                        handleClick={() => {
                            navigator.clipboard.writeText(meetingLink);
                            toast({title: 'Link copied'})
                        }}
                    />
                )
            }
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