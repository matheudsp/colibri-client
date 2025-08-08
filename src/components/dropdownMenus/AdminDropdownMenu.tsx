'use client';

import { ReactNode, useState, useEffect } from 'react';
import { CopyIcon, KeyIcon, CheckIcon, ShieldPlusIcon } from 'lucide-react';
import { CustomRadioGroup } from '../forms/CustomRadioGroup';
import { DropdownMenu } from './DropdownMenu';
import { toast } from 'sonner';
import { AuthService } from '../../services/domains/authService';
import { cameraType } from '../../constants';
import { CustomReadOnlyFormInput } from '../forms/CustomReadOnlyFormInput';

interface AdminDropdownMenuProps {
    trigger: ReactNode;
    projectId?: string;
}

export function AdminDropdownMenu({
    trigger,
    projectId,
}: AdminDropdownMenuProps) {
    const [cameraOption, setCameraOption] = useState<string>('');
    const [accessKey, setAccessKey] = useState<string>('');
    const [expiresAt, setExpiresAt] = useState<Date | null>(null);
    const [copied, setCopied] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        if (!projectId) return;

        const savedKey = localStorage.getItem(`accessKey_${projectId}`);
        if (savedKey) {
            const { key, expiresAt } = JSON.parse(savedKey);
            if (new Date(expiresAt) > new Date()) {
                setAccessKey(key);
                setExpiresAt(new Date(expiresAt));
            } else {
                localStorage.removeItem(`accessKey_${projectId}`);
            }
        }
    }, [projectId]);

    const handleCopyLink = () => {
        const message = `🔗 Link de acesso à vistoria:\nhttps://fagon-client.vercel.app/accessKey\n\nClique no link acima para abrir a página onde você deve colar a chave de acesso.\n\n👉 A chave que deverá ser copiada será enviada logo em seguida.`;
        navigator.clipboard.writeText(message);
        toast.success('Link copiado com sucesso!');
    };

    const handleGenerateAccessKey = async () => {
        if (!cameraOption || !projectId) return;

        setIsGenerating(true);
        const toastId = toast.loading('Gerando chave...');

        try {
            const response = await AuthService.generateAccessKey({
                projectId,
                cameraType:
                    cameraOption === 'camera_360' ? 'camera_360' : 'normal',
            });

            const { token, expiresAt: expiryDate } = response.data;

            const newExpiresAt = new Date(expiryDate);
            setAccessKey(token);
            setExpiresAt(newExpiresAt);

            localStorage.setItem(
                `accessKey_${projectId}`,
                JSON.stringify({
                    key: token,
                    expiresAt: newExpiresAt.toISOString(),
                }),
            );

            toast.success('Chave gerada!', { id: toastId });
        } catch (error) {
            console.error('[ERROR] Falha na geração:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopyKey = () => {
        if (!accessKey) return;
        navigator.clipboard.writeText(accessKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success('Chave de acesso copiada para a área de transferência!');
    };

    const getRemainingTime = () => {
        if (!expiresAt) return '';

        const now = new Date();
        const diff = expiresAt.getTime() - now.getTime();

        if (diff <= 0) {
            localStorage.removeItem(`accessKey_${projectId}`);
            return 'Expirada';
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        return `(Expira em ${hours}h ${minutes}m)`;
    };

    const items = [
        {
            label: 'Copiar Link do Vistoriador',
            action: handleCopyLink,
            icon: <CopyIcon className="w-5 h-5" />,
            className: 'cursor-pointer',
        },
        ...(!accessKey
            ? [
                  {
                      label: '',
                      type: 'custom' as const,
                      customContent: (
                          <div className="px-2 py-1">
                              <CustomRadioGroup
                                  options={cameraType}
                                  selectedValue={cameraOption}
                                  onChange={setCameraOption}
                                  name="camera-options"
                                  className="space-y-2"
                                  textColor="text-foreground"
                                  borderColor="border-foreground"
                                  checkedBorderColor="border-primary"
                              />
                          </div>
                      ),
                  },
              ]
            : []),
        accessKey
            ? {
                  label: '',
                  type: 'custom' as const,
                  customContent: (
                      <div className="px-2 py-1">
                          <div className="text-xs text-gray-500 mb-1">
                              Chave de Acesso {getRemainingTime()}
                          </div>
                          <div className="flex items-center gap-2">
                              <CustomReadOnlyFormInput
                                  value={accessKey}
                                  icon={<KeyIcon className="w-5 h-5" />}
                                  label="Chave"
                                  className="flex-1"
                              />
                              <button
                                  onClick={handleCopyKey}
                                  className="p-2 rounded-md hover:bg-gray-100"
                                  title="Copiar chave"
                              >
                                  {copied ? (
                                      <CheckIcon className="w-5 h-5 text-green-500" />
                                  ) : (
                                      <CopyIcon className="w-5 h-5" />
                                  )}
                              </button>
                          </div>
                      </div>
                  ),
              }
            : {
                  label: isGenerating ? 'Gerando...' : 'Gerar Chave',
                  action: handleGenerateAccessKey,
                  icon: <ShieldPlusIcon className="w-5 h-5" />,
                  disabled: !cameraOption || isGenerating,
                  className: !cameraOption
                      ? 'opacity-50 cursor-not-allowed'
                      : '',
              },
    ];

    return (
        <DropdownMenu trigger={trigger} items={items} onOpenChange={() => {}} />
    );
}
