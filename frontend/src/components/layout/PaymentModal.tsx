import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "../ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import {
  AlertCircle,
  CheckCircle,
  Copy,
  FileText,
  Loader2,
  QrCode,
} from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  tournamentId: number;
  tournamentName: string;
  price: number;
}

export function PaymentModal({
  isOpen,
  onClose,
  tournamentId,
  tournamentName,
  price,
}: PaymentModalProps) {
  const [step, setStep] = useState<"confirm" | "payment">("confirm");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [decklist, setDecklist] = useState("");

  const { user } = useAuth();

  const [pixData, setPixData] = useState<{
    qrCodeBase64: string;
    copyPaste: string;
  } | null>(null);

  const [copied, setCopied] = useState(false);

  const formatMoney = (value: number | string) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(value));
  };

  async function handleConfirmRegistration() {
    setLoading(true);
    setError("");

    if (!user?.sub) {
      setError("Usuário não identificado. Faça login novamente");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/registrations", {
        tournamentId: Number(tournamentId),
        userId: Number(user.sub),
        decklist: decklist,
      });

      const mpData = response.data.pix;

      const qrCodeBase64 = mpData?.qr_code_base64;
      const copyPaste = mpData?.qr_code;

      if (!qrCodeBase64 || !copyPaste) {
        throw new Error("Dados do pix não encontrados na requisição");
      }

      setPixData({
        qrCodeBase64,
        copyPaste,
      });

      setStep("payment");
    } catch (error: any) {
      console.error(error);

      const message = error.response?.data?.message;
      setError(
        Array.isArray(message)
          ? message[0]
          : message || "Erro ao gerar inscrição"
      );
    } finally {
      setLoading(false);
    }
  }

  function handleCopyPix() {
    if (pixData?.copyPaste) {
      navigator.clipboard.writeText(pixData.copyPaste);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleClose() {
    onClose();

    setTimeout(() => {
      setStep("confirm");
      setPixData(null);
      setError("");
    }, 300);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {step === "confirm" ? (
              <>Confirmar Inscrição</>
            ) : (
              <>
                <QrCode className="text-green-500" />
                Pagamento Via Pix
              </>
            )}
          </DialogTitle>

          <DialogDescription className="text-slate-400">
            {step === "confirm"
              ? `Você está se inscrevendo em ${tournamentName}`
              : "Escaneie o QR code ou copie o código abaixo para realizar o pagamento"}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {step === "confirm" ? (
            <div className="space-y-4">
              {/* valor da inscrição */}
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Total a pagar:</span>
                <span className="text-2xl font-bold text-green-400">
                  {formatMoney(price)}
                </span>
              </div>

              {/* add decklist */}
              <div className="space-y-2">
                <Label
                  htmlFor="decklist"
                  className="text-slate-300 flex items-center gap-2"
                >
                  <FileText className="h-4 w-4 text-purple-400" />
                  Decklist (Link ou código){" "}
                  <span className="text-slate-500 text-xs">(Opcional)</span>
                </Label>

                <Input
                  id="decklist"
                  placeholder="Cole sua decklist (ex: PokemonCard.io)"
                  value={decklist}
                  onChange={(e) => setDecklist(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-600 focus-visible:ring-purple-500"
                />
              </div>

              {error && (
                <div className="text-red-400 text-sm flex items-center gap-2 bg-red-950/20 p-3 rounded border border-red-900/50">
                  <AlertCircle className="w-4 h-4" /> {error}
                </div>
              )}
            </div>
          ) : (
            // Tela do Pix
            <div className="flex flex-col items-center space-y-6">
              <div className="bg-white p-2 rounded-lg">
                {pixData?.qrCodeBase64 ? (
                  <img
                    src={`data:image/png;base64,${pixData.qrCodeBase64}`}
                    alt="QR Code PIX"
                    className="w-48 h-48 object-contain"
                  />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center text-black">
                    Erro na imagem
                  </div>
                )}
              </div>

              <div className="w-full space-y-2">
                <Label className="text-xs text-slate-500 uppercase font-bold">
                  Pix Copia e Cola
                </Label>

                <div className="flex gap-2">
                  <Input
                    value={pixData?.copyPaste}
                    readOnly
                    className="bg-slate-950 border-slate-800 text-slate-300 font-mono text-xs h-10"
                  />

                  <Button
                    size="icon"
                    onClick={handleCopyPix}
                    className={
                      copied
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-slate-800 hover:bg-slate-700"
                    }
                  >
                    {copied ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="text-center text-sm text-yellow-500/80 bg-yellow-500/10 p-3 rounded border border-yellow-500/20 w-full">
                Após o pagamento, sua inscrição será confirmada automaticamente
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-between gap-2">
          {step === "confirm" ? (
            <>
              <Button
                variant="ghost"
                onClick={handleClose}
                disabled={loading}
                className="text-slate-400 hover:text-slate-800"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleConfirmRegistration}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Confirmar e Gerar Pix"
                )}
              </Button>
            </>
          ) : (
            <Button
              onClick={handleClose}
              className="w-full bg-slate-800 hover:bg-slate-700"
            >
              Fechar Janela
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
