import { decryptData, encryptData } from "../utils/crypto.util.js";
import Task from "../models/task.model.js";

//Allows user to create new tasks
export const createTaskController = async (req, res) => {
  const { title, description, due_date, priority } = req.body;
  try {
    //takes user input, creates the Task object, and saves to Mongo
    const task = await Task.create({
      user: req.user._id,
      title: decryptData(title),
      description: decryptData(description),
      due_date: decryptData(due_date),
      priority: decryptData(priority),
      creator: req.user.name,
    });
    return res.status(200).json({ message: "Task Successfull created",task });
  } catch (error) {
    return res.status(400).json({
      error: "Task Creation Failed. Please try again",
    });
  }
};

//queries all existing tasks in order to render them on task list page
export const getAllTaskController = async (req, res) => {
  const limit = parseInt(req.query.limit);
  const offset = parseInt(req.query.offset);
  const status = req.query.status;
  let where = {};
  if (status && status != "ALL") {
    where = {
      status,
    };
  }
  try {
    //get collection of tasks with pagination parameters
    const tasks = await Task.find(where).skip(offset).limit(limit);
    const total_docs = await Task.countDocuments(where);
    const totalPages = Math.ceil(total_docs / limit);
    const currentPage = Math.ceil(total_docs % offset);
    res.status(200).send({
      //maps all field values to the tasks collection objects
      tasks: tasks.map((task) => ({
        _id: task._id,
        user: task.user,
        title: encryptData(task.title),
        description: encryptData(task.description),
        priority: encryptData(task.priority),
        due_date: task.due_date,
        status: encryptData(task.status),
        creator: encryptData(task.creator),
      })),
      pagination: {
        total: total_docs,
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

//gets task detail by id
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

//allows user to update existing task
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

//allows user to delete task
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
