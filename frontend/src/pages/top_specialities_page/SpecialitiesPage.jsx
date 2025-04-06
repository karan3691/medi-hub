import React from "react";
import { SpecialitiesCard } from "../../import-export/ImportExport";

// Placeholder images as data URIs for specialities
const cardiology = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0iI2YwZjBmMCIvPjxwYXRoIGQ9Ik0xMjggNTBjLTQuNCAwLTggMy42LTggOHYzNmMwIDIuMi0xLjggNC00IDRINjdjLTQuNCAwLTggMy42LTggOHYzMmMwIDQuNCAzLjYgOCA4IDhoNDljMi4yIDAgNC0xLjggNC00di0zMmMwLTIuMiAxLjgtNCA0LTRoNjBjMi4yIDAgNCAxLjggNCA0djMyYzAgMi4yLTEuOCA0LTQgNEgxNDBjLTQuNCAwLTggMy42LTggOHYzMmMwIDQuNCAzLjYgOCA4IDhoMzJjNC40IDAgOC0zLjYgOC04di0zMmMwLTIuMi0xLjgtNC00LTRoLTQ1Yy0yLjIgMC00LTEuOC00LTR2LTEwYzAtMi4yIDEuOC00IDQtNGg0NWMyLjIgMCA0IDEuOCA0IDR2MTBjMCAyLjItMS44IDQtNCA0SDEzOWMtMi4yIDAtNCAxLjgtNCA0djMyYzAgMi4yIDEuOCA0IDQgNGgzMmMyLjIgMCA0LTEuOCA0LTR2LTMyYzAtMi4yLTEuOC00LTQtNGgtMTZjLTIuMiAwLTQtMS44LTQtNHYtMTZjMC0yLjIgMS44LTQgNC00aDE2YzIuMiAwIDQgMS44IDQgNHYxNmMwIDIuMi0xLjggNC00IDRoLTE2Yy0yLjIgMC00IDEuOC00IDR2MTZjMCAyLjIgMS44IDQgNCA0aDE2YzIuMiAwIDQtMS44IDQtNHYtMTZjMC0yLjItMS44LTQtNC00aC0xNiIgZmlsbD0iI2VlMzI0MCIvPjwvc3ZnPg==";

const dermatology = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0iI2YwZjBmMCIvPjxwYXRoIGQ9Ik0xMjggNDBjLTIyLjEgMC00MCAxNy45LTQwIDQwdjk2YzAgMjIuMSAxNy45IDQwIDQwIDQwczQwLTE3LjkgNDAtNDB2LTk2YzAtMjIuMS0xNy45LTQwLTQwLTQwem0wIDE2YzEzLjIgMCAyNS41IDEwLjcgMjggMjRoLTU2YzIuNS0xMy4zIDE0LjgtMjQgMjgtMjR6bTI4IDQwdjgwYzAgMTUuNS0xMi41IDI4LTI4IDI4cy0yOC0xMi41LTI4LTI4di04MGg1NnptLTcyIDhjLTQuNCAwLTggMy42LTggOHMzLjYgOCA4IDggOC0zLjYgOC04LTMuNi04LTgtOHptODggMGMtNC40IDAtOCAzLjYtOCA4czMuNiA4IDggOCA4LTMuNiA4LThzLTMuNi04LTgtOHptLTg4IDI0Yy00LjQgMC04IDMuNi04IDhzMy42IDggOCA4IDgtMy42IDgtOC0zLjYtOC04LTh6bTg4IDBjLTQuNCAwLTggMy42LTggOHMzLjYgOCA4IDggOC0zLjYgOC04LTMuNi04LTgtOHoiIGZpbGw9IiNmZjkyODciLz48L3N2Zz4=";

const ent = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0iI2YwZjBmMCIvPjxwYXRoIGQ9Ik0xOTIgOTZjLTEzLjMgMC0yNCAxMC43LTI0IDI0czEwLjcgMjQgMjQgMjQgMjQtMTAuNyAyNC0yNC0xMC43LTI0LTI0LTI0em0wIDE2YzQuNSAwIDggMy41IDggOHMtMy41IDgtOCA4LTgtMy41LTgtOCAzLjUtOCA4LTh6IiBmaWxsPSIjOWQ4ZmZmIi8+PHBhdGggZD0iTTExMiA0OGMtOC45IDAtMTYgNy4xLTE2IDE2djMyYzAgMTcuNy0xNC4zIDMyLTMyIDMyLTguOCAwLTE2IDcuMi0xNiAxNnM3LjIgMTYgMTYgMTZjMTUgMCAyOC41LTYuNSAzNy45LTE2LjlDMTExLjMgMTMzIDEyOCAxMTMuMyAxMjggOTZWNjRjMC04LjktNy4xLTE2LTE2LTE2em0wIDE2djE2aDEzLjdjLTIuNCA2LjItNy40IDExLjItMTMuNiAxMy42djMwLjhjLTYuMyAxMC45LTE0LjYgMTkuMi0yNCAyNC42IDcuMi0xNC44IDIwLjctMjUuOCAzNi43LTI5LjJDMTMwLjQgMTQ0LjUgMTUyIDEyOCAxNTIgMTA0YzAtMTcuNy0xNC4zLTMyLTMyLTMyaC04eiIgZmlsbD0iIzlkOGZmZiIvPjwvc3ZnPg==";

const general = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0iI2YwZjBmMCIvPjxwYXRoIGQ9Ik0xMjggNDBjLTQ4LjYgMC04OCAzOS40LTg4IDg4czM5LjQgODggODggODggODgtMzkuNCA4OC04OC0zOS40LTg4LTg4LTg4em0wIDE2YzM5LjggMCA3MiAzMi4yIDcyIDcycy0zMi4yIDcyLTcyIDcyLTcyLTMyLjItNzItNzIgMzIuMi03MiA3Mi03MnptMCAxNmMtNC40IDAtOCAzLjYtOCA4djQ4YzAgNC40IDMuNiA4IDggOHM4LTMuNiA4LThWODBjMC00LjQtMy42LTgtOC04em0wIDgwYy00LjQgMC04IDMuNi04IDhzMy42IDggOCA4IDgtMy42IDgtOC0zLjYtOC04LTh6IiBmaWxsPSIjNjBhNWZhIi8+PC9zdmc+";

const neurology = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0iI2YwZjBmMCIvPjxwYXRoIGQ9Ik0xMjYgNDhjLTM5LjggMC03MiAzMi4yLTcyIDcyIDAgMzkuOCAzMi4yIDcyIDcyIDcyaDY0YzE3LjcgMCAzMi0xNC4zIDMyLTMycy0xNC4zLTMyLTMyLTMyaC0zMnYtMTZoMzJjOC44IDAgMTYtNy4yIDE2LTE2cy03LjItMTYtMTYtMTZoLTMyYy04LjkgMC0xNi03LjEtMTYtMTZzNy4xLTE2IDE2LTE2aDY0YzguOCAwIDE2IDcuMiAxNiAxNmgtMTZjLTguOCAwLTE2IDcuMi0xNiAxNnM3LjIgMTYgMTYgMTZoMTZjMCA4LjgtNy4yIDE2LTE2IDE2aC0zMiIgZmlsbD0iI2ZmYjE0MCIvPjxwYXRoIGQ9Ik0xMjYgMTEyYy00LjQgMC04IDMuNi04IDggMCA0LjQgMy42IDggOCA4aDMydjE2aC0zMiIgZmlsbD0iI2ZmYjE0MCIvPjwvc3ZnPg==";

const gynec = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0iI2YwZjBmMCIvPjxwYXRoIGQ9Ik0xMDQgNzJjLTEzLjMgMC0yNCAxMC43LTI0IDI0IDAgMTMuMyAxMC43IDI0IDI0IDI0czI0LTEwLjcgMjQtMjRjMC0xMy4zLTEwLjctMjQtMjQtMjR6IiBmaWxsPSIjZmY5M2M0Ii8+PHBhdGggZD0iTTE1MiA3MmMtMTMuMyAwLTI0IDEwLjctMjQgMjQgMCAxMy4zIDEwLjcgMjQgMjQgMjRzMjQtMTAuNyAyNC0yNGMwLTEzLjMtMTAuNy0yNC0yNC0yNHptMTIgMjRjMCA2LjYtNS40IDEyLTEyIDEycy0xMi01LjQtMTItMTIgNS40LTEyIDEyLTEyIDEyIDUuNCAxMiAxMnpNODAgMTI4Yy04LjggMC0xNiA3LjItMTYgMTZ2MTZjMCA4LjggNy4yIDE2IDE2IDE2aDk2YzguOCAwIDE2LTcuMiAxNi0xNnYtMTZjMC04LjgtNy4yLTE2LTE2LTE2SDgwem0wIDE2aDk2djE2SDgwdi0xNnoiIGZpbGw9IiNmZjkzYzQiLz48cGF0aCBkPSJNMTA0IDg4YzQuNCAwIDgtMy42IDgtOHMtMy42LTgtOC04LTggMy42LTggOCAzLjYgOCA4IDh6IiBmaWxsPSIjZmY5M2M0Ii8+PC9zdmc+";

const ortho = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0iI2YwZjBmMCIvPjxwYXRoIGQ9Ik0xMDQgNDBjLTguOCAwLTE2IDcuMi0xNiAxNnYxNmMwIDguOCA3LjIgMTYgMTYgMTZoNDhjOC44IDAgMTYtNy4yIDE2LTE2VjU2YzAtOC44LTcuMi0xNi0xNi0xNmgtNDh6bTAgMTZoNDh2MTZoLTQ4VjU2em00OCAxNjBjOC44IDAgMTYtNy4yIDE2LTE2di0xNmMwLTguOC03LjItMTYtMTYtMTZoLTQ4Yy04LjggMC0xNiA3LjItMTYgMTZ2MTZjMCA4LjggNy4yIDE2IDE2IDE2aDQ4em0wLTE2aC00OHYtMTZoNDh2MTZ6IiBmaWxsPSIjODVlYWE0Ii8+PHBhdGggZD0iTTEzNiAxMDRjLTguOCAwLTE2IDcuMi0xNiAxNnY0OGMwIDguOCA3LjIgMTYgMTYgMTZzMTYtNy4yIDE2LTE2di00OGMwLTguOC03LjItMTYtMTYtMTZ6TTcyIDE2OGMwIDguOCA3LjIgMTYgMTYgMTZzMTYtNy4yIDE2LTE2di00OGMwLTguOC03LjItMTYtMTYtMTZzLTE2IDcuMi0xNiAxNnY0OHptNjQtNDh2NDhoMTYvIiBmaWxsPSIjODVlYWE0Ii8+PC9zdmc+";

const paediatrics = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0iI2YwZjBmMCIvPjxwYXRoIGQ9Ik0xMjggNDBjLTIyLjEgMC00MCAxNy45LTQwIDQwIDAgMjIuMSAxNy45IDQwIDQwIDQwczQwLTE3LjkgNDAtNDBjMC0yMi4xLTE3LjktNDAtNDAtNDB6bTAgMTZjMTMuMyAwIDI0IDEwLjcgMjQgMjRzLTEwLjcgMjQtMjQgMjQtMjQtMTAuNy0yNC0yNCAxMC43LTI0IDI0LTI0em0wIDcyYy0zMS44IDAtNTcuNiAyMS02Ni40IDQ5LjZDNTAgMTkwLjYgNTkuMiAyMDAgNzIgMjAwaDExMmMxMi44IDAgMjItOS40IDEwLjQtMjIuNEM1ODUuNiAxNDkgMTU5LjggMTI4IDEyOCAxMjh6bTAgMTZjMjIuNSAwIDQ0LjIgNy41IDU1LjkgMjAuNiA0LjkgNS41IDguNiAxMS45IDEwLjEgMTkuNGgtMTMyYzEuNS03LjUgNS4yLTEzLjkgMTAuMS0xOS40QzgzLjggMTUxLjUgMTA1LjUgMTQ0IDEyOCAxNDR6IiBmaWxsPSIjZmZjYzYxIi8+PC9zdmc+";

// Sample data in the component
const specialities = [
  {
    name: "Cardiology",
    icon: cardiology,
    desc: "For heart and blood pressure problems",
    symptoms: ["Chest pain", "Heart Failure", "Cholesterol"],
  },
  {
    name: "Dermatology",
    icon: dermatology,
    desc: "Specialists for skin and hair treatments",
    symptoms: ["Rashes", "Pimples", "Acne", "Hairfall", "Dandruff"],
  },
  {
    name: "ENT",
    icon: ent,
    desc: "ENT specialists for Ear, Nose and Throat",
    symptoms: ["Earache", "Bad breath", "Swollen neck", "Vertigo"],
  },
  {
    name: "General Physician",
    icon: general,
    desc: "Managing acute medical conditions",
    symptoms: ["Typhoid", "Abdominal Pain", "Migraine", "Infections"],
  },
  {
    name: "Neurology",
    icon: neurology,
    desc: "Managing issues of the nervous system, brain",
    symptoms: ["Stroke", "Dementia", "Epilepsy", "Movement issues"],
  },
  {
    name: "Obstetrics & Gynaecology",
    icon: gynec,
    desc: "For women health issues and surgeries",
    symptoms: ["Irregular periods", "Pregnancy", "PCOD/PCOS"],
  },
  {
    name: "Orthopaedics",
    icon: ortho,
    desc: "Managing issues of bones, joints, knees",
    symptoms: ["Knee Pain", "Shoulder Pain", "Bone deformity"],
  },
  {
    name: "Paediatrics",
    icon: paediatrics,
    desc: "Specialists to care and treat children",
    symptoms: ["Constipation", "Puberty", "Nutrition", "Autism"],
  },
];

const SpecialitiesPage = () => {
  return (
    <div className="page-content p-0 m-0">
      <div className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-dark_theme mb-3">Medical Specialities</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose from our wide range of medical specialities with expert doctors for your healthcare needs
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {specialities.map((speciality, index) => (
              <SpecialitiesCard key={index} speciality={speciality} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialitiesPage;
