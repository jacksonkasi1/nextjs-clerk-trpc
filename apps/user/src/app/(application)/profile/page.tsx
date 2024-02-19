"use client";

import { Fragment, useState } from "react";

import { PiEnvelopeSimple, PiSealCheckFill } from "react-icons/pi";

import { Loader, Title, Text, Input } from "rizzui";
import toast from "react-hot-toast";
import { SubmitHandler } from "react-hook-form";

import FormGroup from "../../../app/shared/form-group";
import Copy from "../../../components/ui/Copy";
import Typography from "../../../components/ui/Typography";
import { Form } from "../../../components/ui/form";
import ImageUpdate from "../../../components/ImageUpdate";
import FormFooter from "../../../components/form-footer";

import cn from "../../../utils/class-names";
import {
  defaultValues,
  personalInfoFormSchema,
  PersonalInfoFormTypes,
} from "../../../utils/validators/personal-info.schema";

import {api } from "../../../trpc/react";

import { env } from "../../../env.mjs";

function ProfileHeader({
  image,
  title,
  description,
  onImageChange,
  children,
}: React.PropsWithChildren<{
  image?: string;
  title: string;
  description?: string;
  onImageChange: (file: File) => void;
}>) {
  return (
    <div
      className={cn(
        "relative z-0 -mx-4 px-4 pt-28 before:absolute before:start-0 before:top-0 before:h-40 before:w-full before:bg-gradient-to-r before:from-[#ffafbd] before:to-[#ffc3a0] @3xl:pt-[190px] @3xl:before:h-[calc(100%-120px)] md:-mx-5 md:px-5 lg:-mx-8 lg:px-8 xl:-mx-6 xl:px-6 3xl:-mx-[33px] 3xl:px-[33px] 4xl:-mx-10 4xl:px-10 dark:before:from-[#ffafbd] dark:before:to-[#ffc3a0]",
      )}
    >
      <div className="relative z-10 mx-auto flex w-full max-w-screen-2xl flex-wrap items-end justify-start gap-6 border-b border-dashed border-muted pb-10">
        <div className="relative -top-1/3 aspect-square w-[110px] overflow-hidden rounded-full border-[6px] border-white bg-gray-100 shadow-profilePic @2xl:w-[130px] @5xl:-top-2/3 @5xl:w-[150px] 3xl:w-[200px] dark:border-gray-50">
          <ImageUpdate defaultImage={image} onImageSelect={onImageChange} />
        </div>

        <div>
          <Title
            as="h2"
            className="mb-2 inline-flex items-center gap-3 text-xl font-bold text-gray-900"
          >
            {title}
            <PiSealCheckFill className="h-5 w-5 text-primary md:h-6 md:w-6" />
          </Title>
          {description ? (
            <Text className="text-sm text-gray-500">{description}</Text>
          ) : null}
        </div>
        {children}
      </div>
    </div>
  );
}

export default function Home() {

  const userMutation = api.user.updateUserProfile.useMutation();
  const userProfile = api.user.getUserProfile.useQuery();
  const { data, isLoading } = userProfile;

  const [loader, setLoader] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);


  const onSubmit: SubmitHandler<PersonalInfoFormTypes> = async (formData) => {
    setLoader(true); // Enable loader before starting the mutation

    let photoUrl: string | undefined;

    if (profileImageFile) {
      const imageFormData = new FormData();
      imageFormData.append("file", profileImageFile);

      const response = await fetch("/api/aws/image", {
        method: "POST",
        body: imageFormData,
      });

      if (response.ok) {
        const { data } = await response.json();
        photoUrl = data.url; // Store the URL of the uploaded image
      } else {
        toast.error(<Text as="b">Error uploading image</Text>);
        setLoader(false); // Disable loader if the image upload fails
        return; // Early return to stop further execution
      }
    }

    if (photoUrl) {
      // check this is aws s3 link or not
      if (
        data?.photo_url?.startsWith(
          `https://${env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.amazonaws.com/`,
        )
      ) {
        await fetch("/api/aws/image", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: data?.photo_url }),
        });
      }
    }

    // Prepare the payload for user mutation, conditionally including the photo_url
    const mutationPayload = photoUrl
      ? { ...formData, photo_url: photoUrl }
      : formData;

    userMutation.mutate(mutationPayload, {
      onSuccess: (response) => {
        userProfile.refetch(); // Trigger a refetch of user data
        toast.success(<Text as="b">{response.message}</Text>); // Handle success scenario
      },
      onError: (error) => {
        toast.error(<Text as="b">{error.message}</Text>); // Handle error scenario
      },
      onSettled: () => {
        setLoader(false); // Ensure loader is disabled when mutation is settled (either onSuccess or onError)
      },
    });
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Form<PersonalInfoFormTypes>
      validationSchema={personalInfoFormSchema}
      onSubmit={onSubmit}
      className="@container"
      useFormProps={{
        mode: "onChange",
        defaultValues,
      }}
    >
      {({ register, control, setValue, getValues, formState: { errors } }) => {
        return (
          <Fragment>
            <ProfileHeader
              title={data?.first_name + " " + data?.last_name}
              image={data?.photo_url || undefined}
              description="Update your photo and personal details."
              onImageChange={(file) => {
                setProfileImageFile(file);
              }}
            >
              <div className="w-full sm:w-auto md:ms-auto">
                <div className="flex flex-col gap-1 ">
                  <Typography variant="Regular_H7">Fimga ID</Typography>
                  <div className="col-span-full border-2 border-gray-200 rounded-md w-full py-2 px-2 gap-2 flex items-center justify-between">
                    <Typography variant="Regular_H6">
                      {data?.figma_id || ""}
                    </Typography>
                    <Copy value={data?.figma_id || ""} />
                  </div>
                </div>
              </div>
            </ProfileHeader>

            <FormGroup
              title="Personal Info"
              description="Update your photo and personal details here"
              className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
            />

            <div className="mb-10 grid gap-7 divide-y divide-dashed divide-gray-200 @2xl:gap-9 @3xl:gap-11">
              <FormGroup
                title="Name"
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <Input
                  placeholder="First Name"
                  {...register("first_name")}
                  error={errors.first_name?.message}
                  className="flex-grow"
                  defaultValue={data?.first_name || ""}
                />
                <Input
                  placeholder="Last Name"
                  {...register("last_name")}
                  error={errors.last_name?.message}
                  className="flex-grow"
                  defaultValue={data?.last_name || ""}
                />
              </FormGroup>

              <FormGroup
                title="Email Address"
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <Input
                  className="col-span-full"
                  prefix={
                    <PiEnvelopeSimple className="h-6 w-6 text-gray-500" />
                  }
                  disabled
                  type="email"
                  placeholder="georgia.young@example.com"
                  {...register("email")}
                  error={errors.email?.message}
                  defaultValue={data?.email || ""}
                />
              </FormGroup>
            </div>

            <FormFooter
              isLoading={loader}
              submitBtnText="Save"
              altBtnText="Cancel"
              // handleAltBtn={() => {}} // cancel button action
            />
          </Fragment>
        );
      }}
    </Form>
  );
}
