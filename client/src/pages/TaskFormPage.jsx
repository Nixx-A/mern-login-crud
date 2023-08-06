import { useForm } from "react-hook-form";
import { useTasks } from "../context/TasksContext";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Textarea } from "../components/ui/Textarea";
import { Button } from "../components/ui/Button";
import utc from "dayjs/plugin/utc";
import dayjs from "dayjs";
dayjs.extend(utc);


export default function TaskFormPage () {
  const { createTask, updateTask, getTask } = useTasks()
  const { handleSubmit, register, setValue, formState: { errors } } = useForm()
  const navigate = useNavigate()
  const { id } = useParams()

  const onSubmit = handleSubmit((data) => {
    if (id) {
      console.log({
        ...data,
        date: dayjs(data.date).utc().format()
      });
      updateTask(id, {
        ...data,
        date: dayjs(data.date).utc().format()
      })
      navigate('/tasks')
    } else {
      createTask({
        ...data,
        date: dayjs(data.date).utc().format()
      })
      navigate('/tasks')
    }
  })

  useEffect(() => {
    const loadTask = async () => {
      if (id) {
        const task = await getTask(id);
        setValue("title", task.title);
        setValue("description", task.description);
        setValue("date", task.date ? dayjs(task.date).utc().format("YYYY-MM-DD") : "");
        setValue("completed", task.completed);
      }
    };
    loadTask();
  })

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Label htmlFor="title">Title</Label>
        <Input
          type="text"
          name="title"
          placeholder="Title"
          {...register("title")}
          autoFocus
        />
        {errors.title && (
          <p className="text-red-500 text-xs italic">Please enter a title.</p>
        )}

        <Label htmlFor="description">Description</Label>
        <Textarea
          name="description"
          id="description"
          rows="3"
          placeholder="Description"
          {...register("description")}
        ></Textarea>

        <Label htmlFor="date">Date</Label>
        <Input type="date" name="date" {...register("date")} />
        <Button>Save</Button>
      </form>
    </Card>
  )
}
