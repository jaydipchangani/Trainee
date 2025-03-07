import { message } from 'antd';
import axiosInstance from './axiosInstance';

// ✅ Function to retrieve access token
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    console.error('No access token found. User might be unauthorized.');
    return null;
  }
  return { Authorization: `Bearer ${token}` };
};

// ✅ Fetch Company Records
export const getGroupRecords = async (query: string = "") => {
  try {
    const headers = getAuthHeaders();
    if (!headers) return null;

    const response = await axiosInstance.get("/api/Group/GetGroups", {
      params: { page: 1, pageSize: 10, search: query }, // ✅ Pass search query
      headers,
    });

    console.log("Group Records Response:", response.data);

    if (response.data) {
      message.success(response.data.message);
      return response.data;
    } else {
      message.error('Failed to fetch group records.');
      return null;
    }
  } catch (error: any) {
    console.error("Error fetching group records:", error.response?.data || error.message);
    message.error(error.response?.data?.message || 'Failed to fetch group records.');
    return null;
  }
};

// ✅ Fetch Company Records with Search
export const getCompanyRecords = async (query: string = "") => {
  try {
    const headers = getAuthHeaders();
    if (!headers) return null;

    const response = await axiosInstance.get("/api/Company/GetCompanyRecords", {
      params: {
        page: 1,
        pageSize: 10,
        sortOrder: "asc",
        sortField: "name",
        filterByStatus: "All",
        search: query, // ✅ Pass search query
      },
      headers,
    });

    console.log("Company Records Response:", response.data);

    if (response.data) {
      message.success(response.data.message);
      return response.data;
    } else {
      message.error('Failed to fetch company records.');
      return null;
    }
  } catch (error: any) {
    console.error("Error fetching company records:", error.response?.data || error.message);
    message.error(error.response?.data?.message || 'Failed to fetch company records.');
    return null;
  }
};

// ✅ Fetch Group Class Records with Search
// ...existing code...

// ✅ Fetch Group Class Records with Search and Pagination
export const getGroupClassRecords = async (query: string = "", sortOrder: string = "asc", sortField: string = "GroupName", page: number = 1, pageSize: number = 15, filterByGroup: string = "") => {
  try {
    const headers = getAuthHeaders();
    if (!headers) return null;

    const response = await axiosInstance.get("/api/GRC/GetGRCRecords", {
      params: { searchText: query, sortOrder, sortField, page, pageSize, filterByGroup },
      headers,
    });

    console.log("Group Class Records Response:", response.data);

    if (response.data) {
      message.success(response.data.message);
      return response.data;
    } else {
      message.error('Failed to fetch group class records.');
      return null;
    }
  } catch (error: any) {
    console.error("Error fetching group class records:", error.response?.data || error.message);
    message.error(error.response?.data?.message || 'Failed to fetch group class records.');
    return null;
  }
};

// ...existing code...

// ✅ Fetch Group Class Record by ID
export const getGroupClassRecordById = async (id: number) => {
  try {
    const headers = getAuthHeaders();
    if (!headers) return null;

    const response = await axiosInstance.get(`/api/GRC/GetGRCRecordById?id=${id}`, { headers });

    console.log("Group Class Record By ID Response:", response.data);

    if (response.data) {
      message.success(response.data.message);
      return response.data;
    } else {
      message.error('Failed to fetch group class record by ID.');
      return null;
    }
  } catch (error: any) {
    console.error("Error fetching group class record by ID:", error.response?.data || error.message);
    message.error(error.response?.data?.message || 'Failed to fetch group class record by ID.');
    return null;
  }
};

// ✅ Fetch ERP Company List by Group ID
export const getERPCompanyListByGroupId = async (groupId: number) => {
  try {
    const headers = getAuthHeaders();
    if (!headers) return null;

    const response = await axiosInstance.get(`/api/Company/GetERPCompanyList?groupId=${groupId}`, { headers });

    console.log("ERP Company List By Group ID Response:", response.data);

    if (response.data) {
      message.success(response.data.message);
      return response.data;
    } else {
      message.error('Failed to fetch ERP company list by group ID.');
      return null;
    }
  } catch (error: any) {
    console.error("Error fetching ERP company list by group ID:", error.response?.data || error.message);
    message.error(error.response?.data?.message || 'Failed to fetch ERP company list by group ID.');
    return null;
  }
};

// ✅ Fetch ERP Class List
export const getERPClassList = async (companyAccountId: string, connectionType: number) => {
  try {
    const headers = getAuthHeaders();
    if (!headers) return null;

    const response = await axiosInstance.get("/api/Company/GetERPClassList", {
      headers,
      params: {
        companyAccountId,
        connectionType,
      },
    });

    console.log("ERP Class List Response:", response.data);

    if (response.data) {
      message.success(response.data.message);
      return response.data;
    } else {
      message.error('Failed to fetch ERP class list.');
      return null;
    }
  } catch (error: any) {
    console.error("Error fetching ERP class list:", error.response?.data || error.message);
    message.error(error.response?.data?.message || 'Failed to fetch ERP class list.');
    return null;
  }
};

export const getCurrencyDropdown = async () => {
  try {
    const headers = getAuthHeaders();
    if (!headers) return null;

    const response = await axiosInstance.get("/api/Configuration/GetCurrencyDropdown", { headers });

    console.log("Currency Dropdown Response:", response.data);

    if (response.data) {
      message.success(response.data.message);
      return response.data;
    } else {
      message.error('Failed to fetch currencies.');
      return null;
    }
  } catch (error: any) {
    console.error("Error fetching currencies:", error.response?.data || error.message);
    message.error(error.response?.data?.message || 'Failed to fetch currencies.');
    return null;
  }
};

// ✅ Add or Update Group
export const addOrUpdateGroup = async (groupData: any) => {
  try {
    const headers = getAuthHeaders();
    if (!headers) return null;

    const response = await axiosInstance.post("/api/Group/AddOrUpdateGroup", groupData, { headers });

    console.log("Add/Update Group Response:", response.data);

    if (response.data) {
      message.success(response.data.message);
      return response.data;
    } else {
      message.error('Failed to add/update group.');
      return null;
    }
  } catch (error: any) {
    console.error("Error adding/updating group:", error.response?.data || error.message);
    message.error(error.response?.data?.message || 'Failed to add/update group.');
    throw error;
  }
};



// ✅ Fetch Group Dropdown
export const getGroupDropdown = async (groupType: string) => {
  try {
    const headers = getAuthHeaders();
    if (!headers) return null;

    const response = await axiosInstance.get("/api/Group/GetGroupDropdown", {
      headers,
      params: { groupType },
    });

    console.log("Group Dropdown Response:", response.data);

    if (response.data) {
      message.success(response.data.message);
      return response.data;
    } else {
      message.error('Failed to fetch group dropdown.');
      return null;
    }
  } catch (error: any) {
    console.error("Error fetching group dropdown:", error.response?.data || error.message);
    message.error(error.response?.data?.message || 'Failed to fetch group dropdown.');
    return null;
  }
};

// ✅ Create Group Class
// ...existing code...

// ✅ Create Group Class
export const createGroupClass = async (groupClassData: any) => {
  try {
    const headers = getAuthHeaders();
    if (!headers) return null;

    const response = await axiosInstance.post("/api/GRC/InsertUpdateGRCDetail", groupClassData, { headers });

    console.log("Create Group Class Response:", response.data);

    if (response.data) {
      message.success(response.data.message);
      return response.data;
    } else {
      message.error('Failed to create group class.');
      return null;
    }
  } catch (error: any) {
    console.error("Error creating group class:", error.response?.data || error.message);
    message.error(error.response?.data?.message || 'Failed to create group class.');
    throw error;
  }
};

// ...existing code...

// ...existing code...