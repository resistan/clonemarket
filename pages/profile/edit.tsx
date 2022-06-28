import type { NextPage } from "next";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import useUser from "@libs/client/useUser";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import useMutation from "@libs/client/useMutation";

interface IEditProfile {
  name?: string;
  email?: string;
  phone?: string;
  formErrors?: string;
}
interface IProfileResponse {
  ok: boolean;
  error?: string;
}

const EditProfile: NextPage = () => {
  const { user } = useUser();
  const {
    register,
    setValue,
    handleSubmit,
    setError,
    formState: { errors },
    clearErrors,
  } = useForm<IEditProfile>();
  useEffect(() => {
    // client side
    if (user?.email) setValue("email", user.email);
    if (user?.phone) setValue("phone", user.phone);
    if (user?.name && user?.name !== "Anonymous") setValue("name", user.name);
  }, [user]);
  const [editProfile, { data, loading }] =
    useMutation<IProfileResponse>(`/api/users/me`);
  const onValid = ({ name, email, phone }: IEditProfile) => {
    if (loading) return;
    if (name === "") name = "Anonymous";
    if (email === "" && phone === "" && name === "") {
      setError("formErrors", {
        message:
          "Email or Phone number are required. You need to choose one at least.",
      });
    }
    editProfile({ name, email, phone });
  };
  useEffect(() => {
    // server side
    if (data && !data.ok) {
      setError("formErrors", {
        message: data.error,
      });
    }
  }, [data]);
  return (
    <Layout canGoBack title="Edit Profile">
      <form className="py-10 px-4 space-y-4" onSubmit={handleSubmit(onValid)}>
        <div className="flex items-center space-x-3">
          <div className="w-14 h-14 rounded-full bg-slate-500" />
          <label
            htmlFor="picture"
            className="cursor-pointer py-2 px-3 border hover:bg-gray-50 border-gray-300 rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-gray-700"
          >
            Change
            <input
              id="picture"
              type="file"
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>
        <Input
          register={register("name")}
          required={false}
          label="Name"
          name="name"
          type="text"
        />
        <Input
          register={register("email")}
          required={false}
          label="Email address"
          name="email"
          type="email"
        />
        <Input
          register={register("phone")}
          required={false}
          label="Phone number"
          name="phone"
          type="number"
          kind="phone"
        />
        {errors.formErrors ? (
          <p className="my-2 text-red-500 font-medium">
            {errors.formErrors.message}
          </p>
        ) : null}
        <Button
          onClick={() => clearErrors()}
          loading={loading}
          text="Update profile"
        />
      </form>
    </Layout>
  );
};

export default EditProfile;
