import { activateUser } from "@/app/lib/actions/actions";
import React from "react";

const page = async ({ params }) => {
  const result = await activateUser(params.jwt);
  return (
    <div className="h-[80vh] flex flex-col items-center justify-center">
      <div className="p-3 rounded-md shadow-md">
        {result === "userNotExist" ? (
          <p className="text-2xl text-red-500">The user Does not Exist</p>
        ) : result === "alreadyactivated" ? (
          <p className="text-2xl text-red-500">The user is Already Activated</p>
        ) : result === "success" ? (
          <p className="text-2xl text-green-500">
            Success! The user is now activated
          </p>
        ) : (
          <p className="text-2xl text-red-500">Ooops!! Something went Wrong</p>
        )}
      </div>
    </div>
  );
};

export default page;
