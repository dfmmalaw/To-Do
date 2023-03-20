import { decryptData, encryptData } from "../utils/crypto.util.js";
import Task from "../models/task.model.js";

//Creates new task
export const createTaskController = async (req, res) => {
  const { title, description, due_date, priority } = req.body;
  try {
    const task = await Task.create({
      user: req.auth.sub.split("|")[1],
      title: decryptData(title),
      description: decryptData(description),
      due_date: decryptData(due_date),
      priority: decryptData(priority),
    });
    return res.status(200).json({ message: "Task Successfull created", task });
  } catch (error) {
    return res.status(400).json({
      error: "Task Creation Failed. Please try again",
    });
  }
};
//Retrieves all existing tasks (specific to the user)
export const getAllTaskController = async (req, res) => {
  const limit = parseInt(req.query.limit);
  const offset = parseInt(req.query.offset);
  const status = req.query.status;
  //conditional logic based on status of task
  let where = {
    user: req.auth.sub.split("|")[1],
  };
  if (status && status != "ALL") {
    where = {
      user: req.auth.sub.split("|")[1],
      status,
    };
  }
  try {
    //Querying db to retrieve user specific tasks and handling pagination
    const tasks = await Task.find(where).skip(offset).limit(limit);
    const total_pages = await Task.countDocuments(where);
    const totalPages = Math.ceil(total_pages / limit);
    const currentPage = Math.ceil(total_pages % offset);
    res.status(200).send({
      tasks: tasks.map((task) => ({
        _id: task._id,
        user: task.user,
        title: encryptData(task.title),
        description: encryptData(task.description),
        priority: encryptData(task.priority),
        due_date: task.due_date,
        status: encryptData(task.status),
      })),
      pagination: {
        total: total_pages,
        page: currentPage,
        pages: totalPages,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: error,
    });
  }
};
//Retrieves the details of a specific task (by id)
export const getTaskDetailController = async (req, res) => {
  try {
    const taskDetail = await Task.findById(req.params.id);
    return res.status(200).json({ taskDetail });
  } catch (error) {
    return res.status(400).json({
      error: error,
    });
  }
};
//Updates task details
export const updateTaskController = async (req, res) => {
  let data = {};
  if (req.body.title) {
    data = {
      ...data,
      title: decryptData(req.body.title),
    };
  }
  if (req.body.description) {
    data = {
      ...data,
      description: decryptData(req.body.description),
    };
  }
  if (req.body.due_date) {
    data = {
      ...data,
      due_date: decryptData(req.body.due_date),
    };
  }
  if (req.body.priority) {
    data = {
      ...data,
      priority: decryptData(req.body.priority),
    };
  }
  if (req.body.status) {
    data = {
      ...data,
      status: decryptData(req.body.status),
    };
  }
  try {
    await Task.findOneAndUpdate({ _id: req.params.id }, data);
    return res.status(200).json({ message: "Task Updated" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: "Something went wrong, Please try again later.",
    });
  }
};
//Deletes task
export const deleteTaskController = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Task Deleted" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: "Something went wrong, Please try again later.",
    });
  }
};