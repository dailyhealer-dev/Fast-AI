import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { ChatState } from "../types";

const initialState: ChatState = {
  conversations: [],
  conversation: null,
  messages: [],
  latestMessage: null,
  loading: false,
  error: null,
};


// --- Helper: Auth headers ---
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

// --- Load Conversations ---
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

// --- Load Messages ---
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

// --- Create Conversation ---
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

// --- Send Message with auto-limit (8 messages) ---
export const sendMessage = createAsyncThunk(
  "aichat/sendMessage",
  async (
    { content, conversationId }: { content: string; conversationId?: number },
    { dispatch, getState, rejectWithValue } // note getState here
  ) => {
    try {
      let convId = conversationId;

      // <-- PLACE THE LINE HERE -->
      const state = getState() as { aichat: ChatState };
      const userMessagesCount = state.aichat.messages.filter(
        (msg) => msg.sender === "user"
      ).length;

      // If 8 or more user messages, start a new conversation
      if (userMessagesCount >= 8 || !convId) {
        const newConvAction = await dispatch(createConversation());
        if (createConversation.fulfilled.match(newConvAction)) {
          convId = newConvAction.payload.id;
        } else {
          throw new Error("Failed to create new conversation");
        }
      }

      // Send the message
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/aiassistant/messages/`,
        { content, conversation: convId },
        { headers: getAuthHeaders() }
      );

      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);



// --- Fetch Latest Message ---
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

// --- Slice ---
const aichatSlice = createSlice({
  name: "aichat",
  initialState,
  reducers: {
    clearChatError: (state) => {
      state.error = null;
    },
    resetConversation: (state) => {
      state.conversation = null;
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadConversations.fulfilled, (state, action) => {
        state.conversations = action.payload;
      })
      .addCase(loadMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;

        const newMessage = action.payload as any;
        state.messages.push(newMessage);

        // Keep only last 8 messages
        if (state.messages.length > 8) {
          state.messages = state.messages.slice(-8);
        }

        // Update conversation
        state.conversation = newMessage.conversation;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchLatestMessage.fulfilled, (state, action) => {
        state.latestMessage = action.payload;
      });
  },
});

export const { clearChatError, resetConversation } = aichatSlice.actions;
export default aichatSlice.reducer;
