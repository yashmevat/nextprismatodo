import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function PUT(req, { params }) {
    try {
        const { completed } = await req.json();
    const updatedTodo = await prisma.todo.update({
        where: {
            id: parseInt(params.id),
        },
        data: {
            completed,
        },
    });

    return Response.json(updatedTodo);
    } catch (error) {
        
    }
}

export async function DELETE(req, { params }) {

    try {
        await prisma.todo.delete({
            where: {
                id: parseInt(params.id),
            },
        });
        return Response.json({ message: "Todo deleted",success:true },{status:200});

    } catch (error) {

        return Response.json({ message: "internal vserevr error",success:false },{status:500});
    }
}

export async function PATCH(req, { params }) {
    try {


        const { title } = await req.json();

        if (!title) {

            return Response.json({ success: false, message: "title is required" });
        }
        const updatedTodo = await prisma.todo.update({
            where: {
                id: parseInt(params.id),
            },
            data: {
                title,
            },
        });

        if (!updatedTodo) {

            return Response.json({ message: "update unsuccess", success: false });
        }

        return Response.json({ updatedTodo, success: true }, { status: 200 });
    }
    catch (error) {

        return Response.json({ message: "internal sererv error", success: false }, { status: 500 });
    }
}



export async function GET(req, { params }) {
    const myTodo = await prisma.todo.findFirst({
        where: {
            id: parseInt(params.id),
        },
    });

    if (!myTodo) {
        return Response.json({ message: "Todo not found" }, { status: 404 });
    }

    return Response.json(myTodo);
}
