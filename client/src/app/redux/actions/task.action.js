import axios from "../../utils/axios";
import { getCookie } from "../../utils/auth";
import { setLoading, clearLoading } from "./loading.action";
import {
  GET_USER_TASK_SUCCESS,
  GET_MSG,
  GET_ERROR,
} from "../constants";
import { encryptData } from "../../utils/crypto.util";

export const createTask = (values, closeAddTask) => async (dispatch) => {
  const token = getCookie("token");

  console.log('priority - ', values.priority);

  let body = {
    title: encryptData(values.title),
    description: encryptData(values.description),
    due_date: encryptData(values.due_date),
    priority: encryptData(values.priority)
  };
  try {
    dispatch(setLoading(true));

    const { data } = await axios.post("/create/task", body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(clearLoading(false));
    dispatch({ type: GET_MSG, payload: data.message });
    closeAddTask();
  } catch (err) {
    if (err.response) {
      const {
        response: {
          data: { error },
        },
      } = err;
      console.log(error, "task creation error");
      dispatch({
        type: GET_ERROR,
        payload: error,
      });
    }
    dispatch(clearLoading(false));
  }
};
export const getUserTasks =
  (limit = "5", offset = "0", status = "") =>
  async (dispatch) => {
    const token = getCookie("token");
    try {
      dispatch(setLoading(true));

      const { data } = await axios.get(
        `/tasks?limit=${limit}&offset=${offset}&status=${status}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(clearLoading(false));
      dispatch({
        type: GET_USER_TASK_SUCCESS,
        payload: data,
      });
    } catch (err) {
      if (err.response) {
        const {
          response: {
            data: { error },
          },
        } = err;

        dispatch({
          type: GET_ERROR,
          payload: error,
        });
      }
      dispatch(clearLoading(false));
    }
  };
export const updateTask = (taskID, values,closeAddTask) => async (dispatch) => {
  const token = getCookie("token");
  let body = {};
  if (values.title) {
    body = {
      ...body,
      title: encryptData(values.title),
    };
  }
  if (values.description) {
    body = {
      ...body,
      description: encryptData(values.description),
    };
  }
  if (values.due_date) {
    body = {
      ...body,
      due_date: encryptData(values.due_date),
    };
  }
  if (values.priority) {
    body = {
      ...body,
      priority: encryptData(values.priority),
    };
  }
  if (values.status) {
    body = {
      ...body,
      status: encryptData(values.status),
    };
  }

  try {
    dispatch(setLoading(true));

    const { data } = await axios.patch(`/task/${taskID}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(clearLoading(false));
    dispatch({ type: GET_MSG, payload: data.message });
    closeAddTask()
  } catch (err) {
    if (err.response) {
      const {
        response: {
          data: { error },
        },
      } = err;
      console.log(error, "task creation error");
      dispatch({
        type: GET_ERROR,
        payload: error,
      });
    }
    dispatch(clearLoading(false));
  }
};
export const deleteTaskByID = (id, closeConfirmDelete) => async (dispatch) => {
  const token = getCookie("token");
  try {
    dispatch(setLoading(true));
    const { data } = await axios.delete(`/task/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(clearLoading(false));
    dispatch({ type: GET_MSG, payload: data.message });
    closeConfirmDelete();
  } catch (err) {
    if (err.response) {
      const {
        response: {
          data: { error },
        },
      } = err;

      dispatch({
        type: GET_ERROR,
        payload: error,
      });
    }
    dispatch(clearLoading(false));
  }
};
