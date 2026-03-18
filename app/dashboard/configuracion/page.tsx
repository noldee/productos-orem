"use client";

import { useState } from "react";
import {
  User,
  Mail,
  ShieldCheck,
  Lock,
  LogOut,
  Check,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function ConfiguracionPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState(false);
  const [updatingPass, setUpdatingPass] = useState(false);

  // Iniciales del email
  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : "?";

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      return setPassError("La contraseña debe tener al menos 6 caracteres");
    }
    setPassError("");
    setUpdatingPass(true);
    try {
      await api.post("/auth/forgot-password", { email: user?.email });
      setPassSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
    } catch {
      setPassError("Error al enviar el correo de recuperación");
    } finally {
      setUpdatingPass(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-10 p-4 md:p-10 animate-in fade-in duration-700">
      {/* Header con Perfil */}
      <div className="flex flex-col md:flex-row items-center gap-8 bg-stone-900 p-8 md:p-12 rounded-[40px] text-white shadow-2xl shadow-stone-200">
        {/* Avatar con iniciales */}
        <div className="w-28 h-28 rounded-[32px] bg-stone-800 border-2 border-stone-700 flex items-center justify-center select-none flex-shrink-0">
          <span className="text-3xl font-bold text-stone-300 font-mono">
            {initials}
          </span>
        </div>

        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight truncate max-w-xs">
              {user?.email ?? "—"}
            </h1>
            <Badge
              className={`border-none rounded-full px-4 ${user?.role === "ADMIN" ? "bg-amber-500/20 text-amber-300" : "bg-white/10 text-white"}`}
            >
              {user?.role === "ADMIN" ? "Administrador" : "Cliente"}
            </Badge>
          </div>
          <p className="text-stone-500 text-sm font-mono">
            ID: {user?.id?.slice(0, 8)}...
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 border border-stone-700 text-stone-400 rounded-2xl h-12 px-6 text-sm font-bold uppercase tracking-widest transition-colors hover:border-red-500 hover:text-red-400"
        >
          <LogOut size={16} /> Cerrar Sesión
        </button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="perfil" className="space-y-8">
        <TabsList className="bg-stone-100 p-1 rounded-2xl h-14 w-full md:w-auto flex overflow-x-auto">
          <TabsTrigger
            value="perfil"
            className="rounded-xl px-8 data-[state=active]:bg-white data-[state=active]:shadow-sm gap-2"
          >
            <User size={16} /> Cuenta
          </TabsTrigger>
          <TabsTrigger
            value="seguridad"
            className="rounded-xl px-8 data-[state=active]:bg-white data-[state=active]:shadow-sm gap-2"
          >
            <ShieldCheck size={16} /> Seguridad
          </TabsTrigger>
        </TabsList>

        {/* CUENTA */}
        <TabsContent value="perfil" className="space-y-6">
          <Card className="border-none shadow-xl shadow-stone-100 rounded-[32px] p-4 md:p-6">
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                Información de la Cuenta
              </CardTitle>
              <CardDescription>
                Datos asociados a tu cuenta en ORE M.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                      size={18}
                    />
                    <Input
                      value={user?.email ?? ""}
                      readOnly
                      className="pl-12 h-12 rounded-2xl border-stone-100 bg-stone-50/50 text-stone-500 cursor-default"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">
                    Rol
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                      size={18}
                    />
                    <Input
                      value={
                        user?.role === "ADMIN" ? "Administrador" : "Cliente"
                      }
                      readOnly
                      className="pl-12 h-12 rounded-2xl border-stone-100 bg-stone-50/50 text-stone-500 cursor-default"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notificaciones */}
          <Card className="border-none shadow-xl shadow-stone-100 rounded-[32px] p-4 md:p-6">
            <CardContent className="pt-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1">
                <h3 className="font-bold text-stone-900">
                  Notificaciones por Correo
                </h3>
                <p className="text-sm text-stone-500">
                  Recibe alertas sobre pedidos y novedades del catálogo.
                </p>
              </div>
              <Switch defaultChecked />
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEGURIDAD */}
        <TabsContent value="seguridad" className="max-w-2xl">
          <Card className="border-none shadow-xl shadow-stone-100 rounded-[32px] p-6">
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                Cambiar Contraseña
              </CardTitle>
              <CardDescription>
                Te enviaremos un correo a{" "}
                <span className="font-semibold text-stone-700">
                  {user?.email}
                </span>{" "}
                para restablecer tu contraseña.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {passSuccess ? (
                <div className="flex items-center gap-3 bg-green-50 text-green-700 rounded-2xl p-4">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Check size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">¡Correo enviado!</p>
                    <p className="text-xs text-green-600">
                      Revisa tu bandeja de entrada para restablecer tu
                      contraseña.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">
                      Nueva Contraseña
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                        size={18}
                      />
                      <Input
                        type={showPass ? "text" : "password"}
                        placeholder="Mínimo 6 caracteres"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pl-12 pr-12 h-12 rounded-2xl border-stone-100 bg-stone-50/50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                      >
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {passError && (
                    <p className="text-[11px] text-red-500 font-bold bg-red-50 px-4 py-2 rounded-xl">
                      {passError}
                    </p>
                  )}

                  <Button
                    onClick={handleChangePassword}
                    disabled={updatingPass}
                    className="w-full h-12 rounded-2xl bg-stone-900 text-white font-bold"
                  >
                    {updatingPass ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />{" "}
                        Enviando...
                      </span>
                    ) : (
                      "Enviar correo de recuperación"
                    )}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
