import axios from 'axios';

const BASE_URL = 'https://pixe.la/v1/users';

export interface CreateUserParams {
    token: string;
    username: string;
    agreeTermsOfService: 'yes' | 'no';
    notMinor: 'yes' | 'no';
}

export interface CreateGraphParams {
    username: string;
    token: string;
    id: string;
    name: string;
    unit: string;
    type: 'int' | 'float';
    color: 'shibafu' | 'momiji' | 'sora' | 'ichou' | 'ajisai' | 'kuro';
}

export interface PostPixelParams {
    username: string;
    token: string;
    graphId: string;
    date: string; // yyyyMMdd
    quantity: string;
}

export const createUser = async (params: CreateUserParams) => {
    return axios.post(`${BASE_URL}`, params);
};

export const createGraph = async (params: CreateGraphParams) => {
    const { username, token, ...body } = params;
    return axios.post(`${BASE_URL}/${username}/graphs`, body, {
        headers: { 'X-USER-TOKEN': token },
    });
};

export const postPixel = async (params: PostPixelParams) => {
    const { username, token, graphId, date, quantity } = params;
    // Using POST to "post a pixel". Alternatively PUT could be used to update it idempotently.
    // The user asked for "updating" (update pixel).
    // The docs say:
    // POST /v1/users/<username>/graphs/<graphID> : Post a pixel (accumulate? no, just creates one. If exists, it might error or update depending on mode, actually "It records the quantity of the specified date as a Pixel.")
    // PUT /v1/users/<username>/graphs/<graphID>/<yyyyMMdd> : Update a pixel.
    // Let's support "Update" which is safer for "recording study time" if they want to overwrite or set specific value.
    // However, usually "Post" is for new entries. 
    // Let's checking the requirement: "Post a pixel" vs "Update".
    // The requirement says "Pixelの更新" (Update Pixel). So I will use PUT.

    return axios.put(`${BASE_URL}/${username}/graphs/${graphId}/${date}`, { quantity }, {
        headers: { 'X-USER-TOKEN': token },
    });
};

export const getGraphUrl = (username: string, graphId: string) => {
    return `https://pixe.la/v1/users/${username}/graphs/${graphId}`;
};
