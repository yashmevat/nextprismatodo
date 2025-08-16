import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    const todos = await prisma.todo.findMany();
    if(!todos){
        return Response.json({message:"todos not found"},{status:400})
    }
    return Response.json({todos,message:"todos fetched successfully"},{status:200});
}

export async function POST(req) {
    const {title} = await req.json();
    if(!title){
    return Response.json({message:"Title is required",success:false},{status:400});
    }
    const todo = await prisma.todo.create({
        data:{
            title:title
        }
    });
    return Response.json({success:true,todo});
}

