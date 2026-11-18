import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import Button from "@/Pages/Admin/Components/Button";
import MahasiswaTable from "./MahasiswaTable";
import MahasiswaModal from "./MahasiswaModal";
import { mahasiswaList } from "@/Data/Dummy";
import { confirmDelete, confirmUpdate } from "@/Utils/Helpers/SwalHelpers";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";

const emptyForm = { nim: "", nama: "" };

const Mahasiswa = () => {
  const navigate = useNavigate();

  // State yang di-lift up: semua dikelola di parent
  const [mahasiswa, setMahasiswa] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // Simulasi delay fetch, nanti bisa diganti fetch API
  useEffect(() => {
    const timer = setTimeout(() => setMahasiswa(mahasiswaList), 500);
    return () => clearTimeout(timer);
  }, []);

  const openAddModal = () => {
    setForm(emptyForm);
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const handleEdit = (mhs) => {
    setForm({ nim: mhs.nim, nama: mhs.nama });
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleDelete = (nim) => {
    confirmDelete(() => {
      setMahasiswa((prev) => prev.filter((mhs) => mhs.nim !== nim));
      toastSuccess("Data berhasil dihapus");
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.nim.trim() || !form.nama.trim()) {
      toastError("NIM dan Nama wajib diisi");
      return;
    }

    if (isEdit) {
      confirmUpdate(() => {
        setMahasiswa((prev) =>
          prev.map((mhs) => (mhs.nim === form.nim ? { ...mhs, ...form } : mhs))
        );
        toastSuccess("Data berhasil diperbarui");
        setForm(emptyForm);
        setIsEdit(false);
        setIsModalOpen(false);
      });
      return;
    }

    if (mahasiswa.some((mhs) => mhs.nim === form.nim)) {
      toastError("NIM sudah terdaftar!");
      return;
    }

    setMahasiswa((prev) => [...prev, form]);
    toastSuccess("Data berhasil ditambahkan");
    setForm(emptyForm);
    setIsModalOpen(false);
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <Heading as="h2" className="mb-0 text-left">
          Daftar Mahasiswa
        </Heading>
        <Button onClick={openAddModal}>+ Tambah Mahasiswa</Button>
      </div>

      <MahasiswaTable
        data={mahasiswa}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDetail={(nim) => navigate(`/admin/mahasiswa/${nim}`)}
      />

      <MahasiswaModal
        isOpen={isModalOpen}
        isEdit={isEdit}
        form={form}
        onChange={handleChange}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </Card>
  );
};

export default Mahasiswa;