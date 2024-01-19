"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { forgotPassword, resetPassword } from "@/app/lib/actions/actions";
import { toast } from "react-toastify";
import Password from "@/app/components/passwordStrength/Password";
import { passwordStrength } from "check-password-strength";
import { verifyJwt } from "@/app/lib/jwt";

const FormSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password must be atleast 6 Charcters")
      .max(32, "Password must be less than 32 Charcters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"],
  });

const page = ({ params }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(FormSchema),
  });

  const payLoad = verifyJwt(params.jwt);
  const [passStrength, setPassStrength] = useState(0);

  useEffect(() => {
    setPassStrength(passwordStrength(watch().password).id);
  }, [watch().password]);

  const submitRequest = async (data) => {
    try {
      const result = await resetPassword(params.jwt, data.password);
      if (result) toast.success("Your Password has been reset successfully");
      reset();
    } catch (error) {
      toast.error("Something Went Wrong!");
      console.log(error);
    }
  };
  if (!payLoad) return <div className="flex items-center justify-center h-[80vh text-red-600 text-2xl]">
    <div className="p-3 rounded-md shadow-md">
        The URL is no valid
    </div>

  </div>
  return (
    <>
      <div className="flex justify-center items-center h-[80vh] w-full">
        <div className="shadow-lg p-5 md:w-[30%] w-[90%] rounded-lg border-t-4 border-purple-900 ">
          <h1 className="text-xl font-bold my-4 text-center">Reset Password</h1>
          <form
            onSubmit={handleSubmit(submitRequest)}
            className="flex flex-col gap-3"
          >
            <div className="">
              <input
                type="password"
                {...register("password")}
                name="password"
                placeholder="Enter your Password"
                id="password"
                className="w-full border border-gray-200 px-6 py-2 rounded-md bg-zinc-200 text-gray-900"
              />
              <span className="text-red-600">{errors?.password?.message}</span>
            </div>
            <Password passStrength={passStrength} />
            <div className="">
              <input
                type="password"
                {...register("confirmPassword")}
                name="confirmPassword"
                placeholder="Confirm your Password"
                id="cPassword"
                className="w-full border border-gray-200 px-6 py-2 rounded-md bg-zinc-200 text-gray-900"
              />
              <span className="text-red-600">
                {errors?.confirmPassword?.message}
              </span>
            </div>

            <button
              disabled={isSubmitting}
              className="w-full bg-purple-800 text-white px-2 py-1 rounded-md"
            >
              {isSubmitting ? " Please Wait..." : "SUBMIT"}
            </button>
            {/* <div className="bg-red-500 text-white w-fit text-sm rounded-md mt-2 p-1">Error Message</div> */}
            <Link className="text-sm" href={"/auth/signin"}>
              Go back to Login? <span className="underline">Login</span>
            </Link>
          </form>
        </div>
      </div>
    </>
  );
};

export default page;
