import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { ChatState } from "../types";

const initialState: ChatState = {
  conversation: null,
  messages: [],
  latestMessage: null,
  loading: false,
  error: null,
};

// Helper for auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("access");
  return token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      }
    : {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
};

// Load conversations
export const loadConversations = createAsyncThunk(
  "aichat/loadConversations",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/aiassistant/conversations/`,
        { headers: getAuthHeaders() }
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Load messages from the backend and fetch messages from the database
export const loadMessages = createAsyncThunk(
  "aichat/loadMessages",
  async (conversationId: number, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/aiassistant/messages/?conversation=${conversationId}`,
        { headers: getAuthHeaders() }
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Create a conversation
export const createConversation = createAsyncThunk(
  "aichat/createConversation",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/aiassistant/conversations/`,
        {},
        { headers: getAuthHeaders() }
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Send a message to the backend
export const sendMessage = createAsyncThunk(
  "aichat/sendMessage",
  async (
    { content, conversationId }: { content: string; conversationId?: number },
    { dispatch, rejectWithValue }
  ) => {
    try {
      let convId = conversationId;

      // If no conversationId, create one
      if (!convId) {
        const newConvAction = await dispatch(createConversation());
        if (createConversation.fulfilled.match(newConvAction)) {
          convId = newConvAction.payload.id;
        } else {
          throw new Error("Failed to create conversation");
        }
      }

      // Send message
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/aiassistant/messages/`,
        { content, conversation: convId },
        { headers: getAuthHeaders() }
      );

      // Expect backend to return message or [user, ai]
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch latest message
export const fetchLatestMessage = createAsyncThunk(
  "aichat/fetchLatestMessage",
  async (conversationId: number, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/aiassistant/conversations/${conversationId}/latest-message/`,
        { headers: getAuthHeaders() }
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// aichat Slice
const aichatSlice = createSlice({
  name: "aichat",
  initialState,
  reducers: {
    clearChatError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load conversations
      .addCase(loadConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversation = action.payload;
      })
      .addCase(loadConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Load messages
      .addCase(loadMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(loadMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(action.payload)) {
          state.messages.push(...action.payload);
        } else {
          state.messages.push(action.payload);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch latest message
      .addCase(fetchLatestMessage.fulfilled, (state, action) => {
        state.latestMessage = action.payload;
      });
  },
});

export const { clearChatError } = aichatSlice.actions;
export default aichatSlice.reducer;
