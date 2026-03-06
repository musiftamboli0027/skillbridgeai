import re
import os

with open("old_api_utf8.ts", "r", encoding="utf-8") as f:
    orig = f.read()

# I want to find the class ApiService and translate it into a map of methods.
service_str = orig[orig.find("class ApiService {"):orig.rfind("export const api")]
methods = re.findall(r"(?:(//.*?)\n\s+)?(?:/\*\*(.*?)\*/\s+)?(?:async\s+([\w]+)\((.*?)\)\s*\{([\s\S]*?)\n\s+\})", service_str, re.MULTILINE|re.DOTALL)

out_parts = []
out_parts.append("""import axios, { AxiosRequestConfig } from "axios";

/*
  SkillBridge Frontend API Service
  Production-ready Axios wrapper that always returns response.data
*/

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const client = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("skillbridge_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const data = error.response?.data;
    const status = error.response?.status;
    if (status === 401) {
      if (!data?.notVerified && !window.location.hash.includes("/login")) {
        localStorage.removeItem("skillbridge_token");
        localStorage.removeItem("skillbridge_user");
        window.location.href = "/#/login?error=session_expired";
      }
    }
    return Promise.reject(data || { message: error.message || "Something went wrong" });
  }
);

const request = {
  get: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    client.get(url, config),
  post: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    client.post(url, data, config),
  put: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    client.put(url, data, config),
  patch: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    client.patch(url, data, config),
  delete: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    client.delete(url, config),
};

export const api = {""")

def convert_body(body, is_post=False):
    # e.g.: return this.request('/auth/login', { method: 'POST', body: JSON.stringify({...}) });
    req_match = re.search(r"this\.request\((.*?),\s*\{(.*?)\}\);", body, re.DOTALL)
    if not req_match:
        # e.g.: return this.request('/auth/me');
        req_match = re.search(r"this\.request\((.*?)\);", body)
        if req_match:
            endpoint = req_match.group(1).strip()
            # If endpoint is string literial, insert /api
            return f"request.get(`/api${{ {endpoint}.replace('`','').replace(\"\'\",\"\") }}`)" if "${" not in endpoint else f"request.get(`/api${{endpoint[1:]}"
            # actually better:
            # return f"request.get(`/api` + {endpoint})" -- wait, if endpoint is `/auth/me`, `/api/auth/me`.
            # let's just do a string replacement:
            pass
    return None

import ast
for comment, doc, name, params, body in methods:
    if name == "request":
        continue
    if "eslint-disable" in comment:
        comment = comment.split("eslint-disable")[0].strip()

    # Simplistic body converter for the 80 endpoints
    # Let's extract method: 'POST' etc and url and body.
    body_clean = re.sub(r"//.*", "", body).strip()
    
    # Check if multiple statements, e.g. getAdminStats (Promise.all) Check if there's special handling
    if name == "getAdminStats":
        transformed = """async () => {
        const [enrollmentStats, paymentAnalytics] = await Promise.all([
            request.get('/api/enrollments/stats'),
            request.get('/api/payments/analytics')
        ]);
        return { enrollment: enrollmentStats.stats, payment: paymentAnalytics.data };
    }"""
        out_parts.append(f"  {name}: {transformed},")
        continue
    elif name == "login":
        transformed = """async (credentials: { email: string; password: string }) => {
        const data = await request.post('/api/auth/login', { email: credentials.email, password: credentials.password });
        return { success: data.success, token: data.token, user: data.user };
    }"""
        out_parts.append(f"  {name}: {transformed},")
        continue

    # general case: find endpoint and method
    # "this.request('/endpoint', { method: 'POST', body: JSON.stringify(data) })"
    url_m = re.search(r"this\.request\((.*?)(?:,\s*\{|\))", body)
    if not url_m:
        out_parts.append(f"  // skipped {name}")
        continue
    
    url_val = url_m.group(1).strip()
    if url_val.startswith("'"):
        url_val = f"'/api" + url_val[1:]
    elif url_val.startswith("`"):
        url_val = f"`/api" + url_val[1:]

    meth_m = re.search(r"method:\s*['\"](.*?)['\"]", body)
    req_method = meth_m.group(1).lower() if meth_m else "get"

    body_m = re.search(r"body:\s*JSON\.stringify\((.*?)\)", body)
    data_val = body_m.group(1).strip() if body_m else ""

    # special params
    if name in ["getPublicJobs", "browseJobs"]:
        transformed = f"async ({params}) {{\n{body.replace('this.request(', 'request.get(`/api` + ').replace(');','')}\n    }}"
        out_parts.append(f"  {name}: {transformed},")
        continue
        
    if data_val:
        transformed = f"({params}) => request.{req_method}({url_val}, {data_val})"
    else:
        if req_method in ["post", "put", "patch"] and params:
            # sometimes body might be missing in regex or it's different
            pass
        transformed = f"({params}) => request.{req_method}({url_val})"
        
    out = ""
    if comment:
        out += f"\n  {comment}\n"
    if doc:
        out += f"\n  /**{doc}*/\n"
    out += f"  {name}: {transformed},"
    out_parts.append(out)

out_parts.append("};\n\nexport default api;")

with open(r"d:\Skillbridge2\frontend\src\services\api_new.ts", "w", encoding="utf-8") as f:
    f.write("\n".join(out_parts))

