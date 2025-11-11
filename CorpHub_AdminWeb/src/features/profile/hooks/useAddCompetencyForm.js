// hooks/useAddCompetencyForm.js
import { useState, useEffect, useMemo, useRef } from "react";
import { useCompetency } from "./useCompetency";
import { useDocument } from "./useDocument";

export function useAddCompetencyForm(profile) {
  const DEFAULT_FORM = {
    id: null,
    typeId: "",
    typeName: "",
    name: "",
    levelId: "",
    levelName: "",
    issuedBy: "",
    issuedDate: "",
    expireDate: "",
    note: "",
    documentId: "",
    certificateCode: "",
    verifyUrl: "",
    verificationStatus: "PENDING",
    uploadedById: profile?.id || "",
    uploadedByName: profile?.fullName || "",
    file: null,
    uploaded: false,
  };

  const [form, setForm] = useState(DEFAULT_FORM);
  const [error, setError] = useState("");
  const [showCustomLevel, setShowCustomLevel] = useState(false);
  const [pendingFiles, setPendingFiles] = useState([]);
  const fileInputRef = useRef(null);

  const { types, loadTypes, loading } = useCompetency();
  const {
    types: docTypes,
    uploadDocument,
    getTypes: getDocTypes,
    uploading,
    documents,
    getMyDocuments,
  } = useDocument();

  useEffect(() => {
    loadTypes(true);
    getDocTypes();
  }, []);

  const selectedType = useMemo(
    () => types.find((t) => t.id === form.typeId || t.code === form.typeId),
    [types, form.typeId]
  );
  const levelOptions = selectedType?.levels || [];

  // ================= HANDLERS =================

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError("");
  };

  const handleTypeChange = (e) => {
    const value = e.target.value;
    const typeObj = types.find((t) => t.id === value || t.code === value);
    setForm((f) => ({
      ...f,
      typeId: typeObj?.id || "",
      typeName: typeObj?.name || "",
      levelId: "",
      levelName: "",
    }));
    setShowCustomLevel(false);
  };

  const handleLevelChange = (e) => {
    const value = e.target.value;
    if (value === "CUSTOM") {
      setShowCustomLevel(true);
      setForm((f) => ({ ...f, levelId: "", levelName: "" }));
    } else {
      const levelObj = levelOptions.find((lv) => lv.id === value);
      setForm((f) => ({
        ...f,
        levelId: levelObj?.id || "",
        levelName: levelObj?.name || "",
      }));
      setShowCustomLevel(false);
    }
  };

  const handleSelectFile = (e) => {
    const files = Array.from(e.target.files);
    setPendingFiles(
      files.map((f) => ({
        file: f,
        typeId: "",
        title: f.name,
        description: "",
      }))
    );
  };

  const handleUpload = async (metaList) => {
    const formData = new FormData();
    pendingFiles.forEach((item) => formData.append("files", item.file));
    formData.append(
      "meta",
      new Blob([JSON.stringify(metaList)], { type: "application/json" })
    );

    const documentIds = await uploadDocument(formData);
    if (documentIds?.length > 0) {
      setForm((f) => ({
        ...f,
        documentId: documentIds[0],
        uploaded: true,
      }));
    }
    setPendingFiles([]);
  };

  const resetForm = () => {
    setForm({
      ...DEFAULT_FORM,
      uploadedById: profile?.id || "",
      uploadedByName: profile?.fullName || "",
    });
    setShowCustomLevel(false);
    setError("");
    setPendingFiles([]);
  };

  return {
    form,
    error,
    loading,
    uploading,
    types,
    docTypes,
    levelOptions,
    showCustomLevel,
    pendingFiles,
    fileInputRef,
    canSubmit: form.name && (form.uploaded || form.documentId),
    documents,
    setError,
    setForm,
    resetForm,
    setPendingFiles,
    getMyDocuments,
    handleChange,
    handleTypeChange,
    handleLevelChange,
    handleSelectFile,
    handleUpload,
  };
}
