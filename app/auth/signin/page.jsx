"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
// import Loader from "../components/loader/Loader";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
   password: z.string({
    required_error: "Please Enter your password"
   }),
})
const Page = ({searchParams}) => {
  //   const router = useRouter();
  const {register, handleSubmit ,formState:{errors, isSubmitting}} = useForm({
    resolver:zodResolver(formSchema)
  })
  console.log({searchParams});

  const { data: session } = useSession();
  const router = useRouter();

  const logInUser = async(data)=>{
    try{
      const result = await signIn("credentials",{
        redirect: true,
        email: data.email,
        password: data.password,
        callbackUrl: searchParams.callbackUrl ? searchParams.callbackUrl : "http://localhost:3000"
          })

          if(!result.error){
            console.log(result);
            toast.success("Log in Successfull")
            router.push("")
          }
          else{
            console.log(result.error);
            toast.error(result.error)
          }
    }
    catch(error){
      console.log(error);
      toast.error(error)
    }
  }

  return (
    <>
      {/* {isLoading && <Loader />} */}
      <div className="flex justify-center items-center h-[80vh] w-full">
        <div className="shadow-lg p-5 md:w-[30%] w-[90%] rounded-lg border-t-4 border-purple-900">
          <h1 className="text-xl font-bold my-4 text-center">
            Sign In to your account
          </h1>
          <form
            onSubmit={handleSubmit(logInUser)}
            action=""
            className="flex flex-col gap-3"
          >
            <div className="">
            <input
              type="email"
              name="email"
              {...register("email")}
              placeholder="Enter your email"
              className="w-full border border-gray-200 px-6 py-2 rounded-md bg-zinc-200 text-gray-900"
            />
              <span className="text-red-600">{errors?.email?.message}</span>
            </div>
           <div className="">
           <input
              type="password"
              name="password"
              {...register("password")}
              placeholder="Enter your Password"
              className="w-full border border-gray-200 px-6 py-2 rounded-md bg-zinc-200 text-gray-900"
            />
              <span className="text-red-600">{errors?.password?.message}</span>
           </div>
            <button className="w-full bg-purple-900 hover:bg-purple-800 text-white px-2 py-1 rounded-md" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
            {/* <div className="bg-red-500 text-white w-fit text-sm rounded-md mt-2 p-1">Error Message</div> */}
            <div className="flex justify-between">
            <Link className="text-sm" href={"/auth/forgotPassword"}>
              <span className="underline">Forgot Password?</span>
            </Link>
            <Link className="text-sm" href={"/auth/signup"}>
              Don&apos;t have an account?{" "}
              <span className="underline">Register</span>
            </Link>
            </div>
           
          </form>
        </div>
      </div>
    </>
  );
};

export default Page;
