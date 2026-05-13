export async function getEmployerApplications(jobId: string) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/employer/applications/${jobId}`,
        {
            credentials: "include",
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch job applications");
    }

    return res.json();
}

export async function updateApplicationStatus(applicationId: string, status: "APPROVED" | "REJECTED") {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/employer/applications/${applicationId}/status`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ status }),
        }
    );

    if (!res.ok) {
        throw new Error("Failed to update application status");
    }

    return res.json();
}

export async function getStudentApplications() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/student/applications`,
        {
            credentials: "include",
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch student applications");
    }

    return res.json();
}
