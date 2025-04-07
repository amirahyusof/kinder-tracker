import React from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import Image from "next/image";


export default function ActivityCard({ activityData, childData}){
  const router = useRouter();

  const handleEditTask = (childId, activityId) => {
    const parsedChildId = parseInt(childId);
    router.push(`/mainpage/activities/edit?childId=${childId}&activityId=${activityId}`);
  };

  if(!activityData || !activityData.length === 0){
    return (
      <div className="text-left p-6 bg-[#FFB4B4] text-black rounded-lg">
      <p className="text-gray-700">No undone activities yet! Click the child’s profile to add one.</p>
    </div>
    );
  } 

  return (
    <div className="p-4 w-full">
      <h2 className="text-xl font-bold mb-2">Activities</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 lg:gap-6 mt-2">
        { activityData.map((data) => {
          //find the corresponding child data
          const child = childData.find((child) => child.id.toString() === data.childId);

        return (
          <div key={data.id} className="bg-[#FFB4B4] p-4  shadow rounded space-y-2">
          
            {/* display child's undone activity */}
            <div className="flex flex-row justify-between">
              <div className="flex flex-col space-y-2">
                <h3 className="font-semibold text-gray-600 text-sm">
                  Activity:
                  <span className="text-white capitalize text-md"> {data.activity} </span>
                </h3>
                <div className="flex flex-row space-x-2">
                  <p className="text-sm font-semibold text-gray-600" >
                    Status: <span className="capitalize font-normal">{data.status}</span>
                  </p>
                  {/* Edit Button */}
                  <div className="flex justify-end">
                    <Pencil 
                      className="h-4 w-4 text-white hover:text-[#FF9494] transition "  
                      onClick={() => handleEditTask(data.childId, data.id)} 
                    />
                  </div>
                </div>
              </div>
              
              {/* display child's avatar and name */}
              { child ? (
                <div className="flex flex-col items-center mt-2">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={child.avatar?.src || "/placeholder.png"}
                      width={200}
                      height={200}
                      alt={child.avatar?.alt || "Child's avatar"}
                      className="w-full h-full object-cover"
                      priority
                    />
                  </div>
                  <h2 className=" text-white font-semibold">{child.name}</h2>
                </div>
              ):(
                <p className="text-white">Child not found</p>     
              )}
            </div>
          </div>
        );
        })}
      </div>
    </div>
  );
};
