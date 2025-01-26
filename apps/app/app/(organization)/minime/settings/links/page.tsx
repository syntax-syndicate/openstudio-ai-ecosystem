import Form from "@/components/forms/form";
import { currentUser } from "@repo/backend/auth/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Links",
};
export default async function Links() {
  const user = await currentUser();
  const endpoint = "user";

  return (
    <div className="flex flex-col gap-2">
      <Form
        title="Twitter"
        description="This link will appear on your page."
        prefix="x.com/"
        inputData={{
          name: "twitter",
          placeholder: "your_username",
          defaultValue: user?.user_metadata?.twitter ?? "",
        }}
        endpoint={endpoint}
        required={false}
      />
      <Form
        title="Posts"
        description="This link will appear on your page."
        prefix="posts.cv/"
        inputData={{
          name: "postscv",
          placeholder: "your_username",
          defaultValue: user?.user_metadata?.postscv ?? "",
        }}
        endpoint={endpoint}
        required={false}
      />
      <Form
        title="Dribbble"
        description="This link will appear on your page."
        prefix="dribbble.com/"
        inputData={{
          name: "dribbble",
          placeholder: "your_username",
          defaultValue: user?.user_metadata?.dribbble ?? "",
        }}
        endpoint={endpoint}
        required={false}
      />
      <Form
        title="Github"
        description="This link will appear on your page."
        prefix="github.com/"
        inputData={{
          name: "github",
          placeholder: "your_username",
          defaultValue: user?.user_metadata?.github ?? "",
        }}
        endpoint={endpoint}
        required={false}
      />
      <Form
        title="Linkedin"
        description="This link will appear on your page."
        prefix="linkedin.com/in/"
        inputData={{
          name: "linkedin",
          placeholder: "your_username",
          defaultValue: user?.user_metadata?.linkedin ?? "",
        }}
        endpoint={endpoint}
        required={false}
      />
      <Form
        title="CV"
        description="This link will appear on your page."
        prefix="read.cv/"
        inputData={{
          name: "readcv",
          placeholder: "your_username",
          defaultValue: user?.user_metadata?.readcv ?? "",
        }}
        endpoint={endpoint}
        required={false}
      />
      <Form
        title="Contact email"
        description="This link will appear on your page."
        inputData={{
          name: "contactEmail",
          placeholder: "your@email.com",
          defaultValue: user?.user_metadata?.contact_email ?? "",
        }}
        endpoint={endpoint}
        required={false}
      />
    </div>
  );
}
