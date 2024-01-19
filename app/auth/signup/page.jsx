"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
// import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getSession, useSession } from "next-auth/react";
// import Loader from "../components/loader/Loader";
import { z } from "zod";
import validator from "validator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordStrength } from "check-password-strength";
import Password from "@/app/components/passwordStrength/Password";
import { registerUser } from "@/app/lib/actions/actions";

const formSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be atleast 2 characters")
      .max(45, "First Name must be less than 45 characters"),
    lastName: z
      .string()
      .min(2, "Last name must be atleast 2 characters")
      .max(45, "Last Name must be less than 45 characters"),
    email: z.string().email("Please Enter a valid Email Address"),
    phone: z
      .string()
      .refine(validator.isMobilePhone, "Please Enter a valid phone number"),
    password: z
      .string()
      .min(6, "Password must be atleast 6 charachers")
      .max(30, "Password must be less than 30 charachers"),
    confirmPassword: z
      .string()
      .min(6, "Password must be atleast 6 charachers")
      .max(30, "Password must be less than 30 charachers"),
    // accepted: z.literal(true,{
    //   errorMap:()=>({
    //     message: "Please Accept all terms"
    //   })
    // }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password and Confirm Password Does not match",
    path: ["confirmPassword"],
  });

const Page = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const [passStrength, setPassStrength] = useState(0);

  useEffect(() => {
    setPassStrength(passwordStrength(watch().password).id);
  }, [watch().password]);

  const saveUser = async (data) => {
    const { confirmPassword, ...user } = data;
    try {
      const result = await registerUser(user);
      console.log(result);
      if(result) toast.success("User Successfully Signed Up");
      reset();
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error.stack);
      reset();
    }
  };

  return (
    <>
      {/* {isLoading && <Loader/>} */}
      <div className="flex justify-center items-center h-[80vh] w-full">
        <div className="shadow-lg p-5 md:w-[30%] w-[90%] rounded-lg border-t-4 border-purple-900 ">
          <h1 className="text-xl font-bold my-4 text-center">
            Create a new account
          </h1>
          <form
            onSubmit={handleSubmit(saveUser)}
            className="flex flex-col gap-3"
          >
            <div className="">
              <input
                type="text"
                {...register("firstName")}
                name="firstName"
                id="fname"
                placeholder="Enter your First name"
                className="w-full border border-gray-200 px-6 py-2 rounded-md bg-zinc-200 text-gray-900"
              />
              <span className="text-red-600">{errors?.firstName?.message}</span>
            </div>
            <div className="">
              <input
                type="text"
                {...register("lastName")}
                name="lastName"
                id="lname"
                placeholder="Enter your Last name"
                className="w-full border border-gray-200 px-6 py-2 rounded-md bg-zinc-200 text-gray-900"
              />
              <span className="text-red-600">{errors?.lastName?.message}</span>
            </div>
            <div className="">
              <input
                type="email"
                {...register("email")}
                name="email"
                id="email"
                placeholder="Enter your email"
                className="w-full border border-gray-200 px-6 py-2 rounded-md bg-zinc-200 text-gray-900"
              />
              <span className="text-red-600">{errors?.email?.message}</span>
            </div>
            <div className="">
              <input
                type="text"
                {...register("phone")}
                name="phone"
                id="phone"
                placeholder="Enter your Phone Number"
                className="w-full border border-gray-200 px-6 py-2 rounded-md bg-zinc-200 text-gray-900"
              />
              <span className="text-red-600">{errors?.phone?.message}</span>
            </div>
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

            <button className="w-full bg-purple-800 text-white px-2 py-1 rounded-md">
              Register
            </button>
            {/* <div className="bg-red-500 text-white w-fit text-sm rounded-md mt-2 p-1">Error Message</div> */}
            <Link className="text-sm" href={"/auth/signin"}>
              Already have an account? <span className="underline">Login</span>
            </Link>
          </form>
        </div>
      </div>
    </>
  );
};

export default Page;
