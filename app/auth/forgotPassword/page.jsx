"use client";
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from "zod";
import Link from "next/link";
import { forgotPassword } from '@/app/lib/actions/actions';
import { toast } from "react-toastify";

const FormSchema = z.object({
    email: z.string().email("Please Enter a valid Email")
})

const page = () => {
    const {register, handleSubmit, reset, formState:{errors,isSubmitting}} =useForm({
        resolver: zodResolver(FormSchema)
    })

    const submitRequest=async(data)=>{
        try{
            const result = await forgotPassword(data.email);
            if(result) toast.success("Reset Password Link sent to your email");
            reset();
        }
        catch(error){
            toast.error("Something Went Wrong!")
            console.log(error);
        }
    }
  return (
    <>
    <div className="flex justify-center items-center h-[80vh] w-full">
        <div className="shadow-lg p-5 md:w-[30%] w-[90%] rounded-lg border-t-4 border-purple-900 ">
          <h1 className="text-xl font-bold my-4 text-center">
            Forgot Password
          </h1>
          <form
            onSubmit={handleSubmit(submitRequest)}
            className="flex flex-col gap-3"
          >
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
            <button disabled={isSubmitting} className="w-full bg-purple-800 text-white px-2 py-1 rounded-md">
              {isSubmitting? " Please Wait..." : "SUBMIT"}
            </button>
            {/* <div className="bg-red-500 text-white w-fit text-sm rounded-md mt-2 p-1">Error Message</div> */}
            <Link className="text-sm" href={"/auth/signin"}>
              Go back to Login? <span className="underline">Login</span>
            </Link>
          </form>
        </div>
      </div>
    </>
    
  )
}

export default page