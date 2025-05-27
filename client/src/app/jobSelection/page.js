"use client";

import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation"; // ✅ Fix
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, CheckCircle2, Upload } from "lucide-react";
import axios from "axios";

const jobRoles = [
  { id: "frontend", title: "Frontend Developer", description: "HTML, CSS, React, UI/UX" },
  { id: "backend", title: "Backend Developer", description: "Node.js, APIs, Databases" },
  { id: "fullstack", title: "Full Stack Developer", description: "React, Node, DBs" },
  { id: "react", title: "React Developer", description: "React, Hooks, Tailwind" },
  { id: "node", title: "Node.js Developer", description: "Express, MongoDB, REST" },
  { id: "java", title: "Java Developer", description: "Spring Boot, OOP, APIs" },
  { id: "python", title: "Python Developer", description: "Django, Flask, ML" },
  { id: "c++", title: "C++ Developer", description: "C++, STL, Systems Programming" },
  { id: "datasci", title: "Data Scientist", description: "ML, Python, SQL, Stats" },
  { id: "product", title: "Product Manager", description: "Agile, PM tools, Strategy" },
  { id: "designer", title: "UI/UX Designer", description: "Figma, Prototyping, Usability" },
  { id: "software", title: "Software Developer", description: "Software Design, Algorithms" },
];

export default function JobSelection() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "" });
  const router = useRouter(); // ✅ Correct hook

  const handleJobSelect = (job) => {
    setSelectedJob(job);
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file?.type === "application/pdf") {
      setResumeFile(file);
    } else {
      alert("Please upload a PDF file.");
    }
  };

  const handleOpenModal = () => {
    if (!selectedJob) return alert("Please select a job role first.");
    setIsOpen(true);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitForm = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !resumeFile) {
      alert("Please fill all fields and upload a resume.");
      return;
    }

    const data = new FormData();
    data.append("first_name", formData.firstName);
    data.append("last_name", formData.lastName);
    data.append("email", formData.email);
    data.append("job_id", selectedJob.id);
    data.append("job_title", selectedJob.title);
    data.append("resume", resumeFile);

    try {
      // await axios.post("/getDetails", data); // Optional server post
      setIsOpen(false);

      // ✅ Fixed: use correct query params syntax
      const query = `job=${encodeURIComponent(selectedJob.title)}&firstName=${encodeURIComponent(
        formData.firstName
      )}&lastName=${encodeURIComponent(formData.lastName)}&email=${encodeURIComponent(
        formData.email
      )}`;

      router.push(`/interview?${query}`);
    } catch (err) {
      console.error(err);
      alert("Error submitting form.");
    }
  };

  return (
    <section className="max-w-6xl mx-auto py-10">
      <h2 className="text-3xl font-bold text-center mb-8">Select a Job Role</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        {jobRoles.map((job) => (
          <Card
            key={job.id}
            onClick={() => handleJobSelect(job)}
            className={`cursor-pointer hover:shadow-md transition border-2 ${
              selectedJob?.id === job.id ? "border-blue-600 bg-blue-50" : "border-gray-200"
            }`}
          >
            <CardContent className="p-6 space-y-2">
              <div className="flex items-center gap-2">
                <Briefcase className="text-blue-600" />
                <h3 className="text-lg font-semibold">{job.title}</h3>
                {selectedJob?.id === job.id && <CheckCircle2 className="text-green-600 ml-auto" />}
              </div>
              <p className="text-sm text-gray-600">{job.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Resume Upload */}
      <div className="text-center mb-6">
        <label className="flex flex-col items-center gap-2 cursor-pointer">
          <Upload className="text-blue-600" />
          <span className="text-sm text-gray-700">Upload Resume (PDF)</span>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleResumeUpload}
            className="hidden"
          />
        </label>
        {resumeFile && <p className="text-green-600 text-sm mt-2">Uploaded: {resumeFile.name}</p>}
      </div>

      {/* Continue Button */}
      <div className="text-center">
        <Button size="lg" disabled={!selectedJob} onClick={handleOpenModal} className="bg-blue-600 text-white">
          Continue to Interview
        </Button>
      </div>

      {/* Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <Dialog.Title className="text-lg font-medium text-gray-900">
                  Enter Your Details
                </Dialog.Title>
                <div className="mt-4 space-y-3">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleFormChange}
                    className="w-full border px-3 py-2 rounded"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleFormChange}
                    className="w-full border px-3 py-2 rounded"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleFormChange}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>

                <div className="mt-6 flex justify-end">
                  <Button onClick={handleSubmitForm} className="bg-blue-600 text-white">
                    Submit & Start Interview
                  </Button>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>
    </section>
  );
}
