"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { auth, storage } from "@/lib/firebase";
import { onAuthStateChanged, updateProfile, User } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Camera, Save, Loader2, X, Check } from "lucide-react";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/lib/cropImage";

export default function ProfileSettings() {
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  
  // Crop states
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [showCropModal, setShowCropModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setDisplayName(currentUser.displayName || "");
        setPhotoURL(currentUser.photoURL || "");
      }
    });
    return () => unsubscribe();
  }, []);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ text: "ขนาดไฟล์ต้องไม่เกิน 5MB", type: "error" });
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImageSrc(reader.result?.toString() || null);
      setShowCropModal(true);
    });
    reader.readAsDataURL(file);
    
    // Reset file input so same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUploadCroppedImage = async () => {
    if (!imageSrc || !croppedAreaPixels || !user) return;
    
    setIsUploading(true);
    setShowCropModal(false);
    setMessage(null);

    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (!croppedBlob) throw new Error("Could not crop image");

      const storageRef = ref(storage, `profile_pictures/${user.uid}/profile_${Date.now()}.jpg`);
      const uploadTask = uploadBytesResumable(storageRef, croppedBlob);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Upload error:", error);
          setMessage({ text: "เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ", type: "error" });
          setIsUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setPhotoURL(downloadURL);
          
          // Auto-save to Firebase profile so it persists on F5
          await updateProfile(user, { photoURL: downloadURL });
          auth.currentUser?.reload();
          
          setIsUploading(false);
        }
      );
    } catch (error) {
      console.error(error);
      setIsUploading(false);
      setMessage({ text: "อัปโหลดไม่สำเร็จ", type: "error" });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    setMessage(null);

    try {
      await updateProfile(user, {
        displayName: displayName,
        photoURL: photoURL,
      });
      setMessage({ text: "อัปเดตข้อมูลส่วนตัวเรียบร้อยแล้ว!", type: "success" });
      
      // Force reload auth state
      auth.currentUser?.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ text: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return <div className="animate-pulse flex space-x-4 p-4"><div className="rounded-full bg-gray-200 h-10 w-10"></div><div className="flex-1 space-y-6 py-1"><div className="h-2 bg-gray-200 rounded"></div></div></div>;

  return (
    <div className="max-w-2xl bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 shadow-sm relative">
      <h2 className="text-2xl font-bold mb-6 text-[var(--foreground)]">ตั้งค่าโปรไฟล์</h2>
      
      {message && (
        <div className={`p-4 mb-6 rounded-xl text-sm font-medium ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Profile Picture */}
        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[var(--border)] bg-gray-100 shadow-md">
              {photoURL ? (
                <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400 font-bold bg-gradient-to-br from-gray-50 to-gray-200">
                  {displayName ? displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </div>
            
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="absolute bottom-0 right-0 p-2.5 rounded-full bg-brand-blue text-white shadow-lg hover:bg-brand-blue-dark transition-colors border-2 border-white disabled:opacity-50"
            >
              {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileSelect} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
          
          <div className="flex-1 pt-2 text-center sm:text-left">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">รูปโปรไฟล์</h3>
            <p className="text-sm text-gray-500 mt-1">
              แนะนำให้ใช้รูปภาพสี่เหลี่ยมจัตุรัส ระบบมีเครื่องมือตัดรูปให้ก่อนอัปโหลด
            </p>
          </div>
        </div>

        <hr className="border-[var(--border)]" />

        {/* Display Name */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              ชื่อที่แสดง (Display Name)
            </label>
            <input 
              type="text" 
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="กรอกชื่อของคุณ"
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue outline-none transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              อีเมล (Email) - ไม่สามารถแก้ไขได้
            </label>
            <input 
              type="email" 
              value={user.email || ""}
              disabled
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-gray-50 dark:bg-gray-800 text-gray-500 cursor-not-allowed outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSaving || isUploading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-blue text-white font-medium shadow-md hover:bg-brand-blue-dark transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {isSaving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
          </button>
        </div>
      </form>

      {/* Crop Modal */}
      {showCropModal && imageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[var(--surface)] w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-[var(--border)] flex justify-between items-center">
              <h3 className="text-lg font-bold text-[var(--foreground)]">ปรับขนาดรูปภาพ</h3>
              <button 
                onClick={() => setShowCropModal(false)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="relative w-full h-[400px] bg-black">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            
            <div className="p-4 border-t border-[var(--border)]">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-medium text-gray-500">ซูม</span>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowCropModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-medium transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleUploadCroppedImage}
                  className="flex items-center gap-2 px-6 py-2 rounded-xl bg-brand-blue text-white font-medium shadow-md hover:bg-brand-blue-dark transition-colors"
                >
                  <Check size={18} />
                  ยืนยันและอัปโหลด
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
