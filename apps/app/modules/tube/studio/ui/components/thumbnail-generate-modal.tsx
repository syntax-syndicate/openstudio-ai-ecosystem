import { ResponsiveModal } from '@/components/responsive-dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/design-system/components/ui/form';
import { Textarea } from '@repo/design-system/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface ThumbnailGenerateModalProps {
  videoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  prompt: z.string().min(10),
});

export const ThumbnailGenerateModal = ({
  videoId,
  open,
  onOpenChange,
}: ThumbnailGenerateModalProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  //   const generateThumbnail = trpc.videos.generateThumbnail.useMutation({
  //     onSuccess: () => {
  //       toast.success("Background job started", { description: "This may take some time" });
  //       form.reset();
  //       onOpenChange(false);
  //     },
  //     onError: () => {
  //       toast.error("Something went wrong");
  //     },
  //   });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // generateThumbnail.mutate({
    //   id: videoId,
    //   prompt: values.prompt,
    // });
  };

  return (
    <ResponsiveModal
      title="Upload a thumbnail"
      open={open}
      onOpenChange={onOpenChange}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prompt</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="resize-none"
                    cols={30}
                    rows={5}
                    placeholder="It is bit complex - Need to create a headshots finetuned model of a person and then use that along with canvas like editor to create a thumbnail"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button disabled={true} type="submit">
              Generate (Coming Soon) - Not sure when
            </Button>
          </div>
        </form>
      </Form>
    </ResponsiveModal>
  );
};
