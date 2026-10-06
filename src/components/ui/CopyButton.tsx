import { useToast } from '../../hooks/useToast';
import { Button } from './Button';

export function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const toast = useToast();
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard');
    } catch {
      toast.error('Could not copy. Select the text and copy it manually.');
    }
  }
  return (
    <Button type="button" variant="secondary" onClick={copy}>
      {label}
    </Button>
  );
}
