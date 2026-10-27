import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from '@hello-pangea/dnd';
import { ImagePlus, Loader2, Star, X } from 'lucide-react';
import { cn, toast } from '_shared';
import { Image } from '_entities/listing';
import { MAX_UPLOAD_BYTES, uploadFile } from '_entities/resource';

const MAX_IMAGES = 8;

interface Pending {
  key: string;
  preview: string;
}

export const ImageUploader = ({
  value,
  onChange,
  error,
}: {
  value: Image[];
  onChange: (images: Image[]) => void;
  error?: string;
}) => {
  const { t } = useTranslation();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [pending, setPending] = React.useState<Pending[]>([]);
  const [dragOver, setDragOver] = React.useState(false);
  // Uploads finish asynchronously; read the latest list, not a stale closure.
  const latest = React.useRef(value);
  latest.current = value;

  const addFiles = async (files: File[]) => {
    const room = MAX_IMAGES - latest.current.length - pending.length;
    const images = files.filter((f) => f.type.startsWith('image/'));
    if (images.length > room)
      toast.error(t('upload.limit', { max: MAX_IMAGES }));
    const accepted = images.slice(0, Math.max(room, 0)).filter((f) => {
      if (f.size > MAX_UPLOAD_BYTES) {
        toast.error(t('upload.tooLarge', { name: f.name }));
        return false;
      }
      return true;
    });
    const items = accepted.map((file) => ({
      file,
      key: crypto.randomUUID(),
      preview: URL.createObjectURL(file),
    }));
    setPending((p) => [
      ...p,
      ...items.map(({ key, preview }) => ({ key, preview })),
    ]);

    await Promise.all(
      items.map(async ({ file, key, preview }) => {
        const res = await uploadFile(file);
        setPending((p) => p.filter((x) => x.key !== key));
        URL.revokeObjectURL(preview);
        if (!res) {
          toast.error(t('upload.failed', { name: file.name }));
          return;
        }
        const next = [
          ...latest.current,
          { ...res, position: latest.current.length },
        ];
        latest.current = next;
        onChange(next);
      })
    );
  };

  const remove = (id: string) =>
    onChange(
      value
        .filter((i) => i.id !== id)
        .map((img, i) => ({ ...img, position: i }))
    );

  const onDragEnd = (r: DropResult) => {
    if (!r.destination) return;
    const list = [...value];
    const [moved] = list.splice(r.source.index, 1);
    list.splice(r.destination.index, 0, moved);
    onChange(list.map((img, i) => ({ ...img, position: i })));
  };

  const canAdd = value.length + pending.length < MAX_IMAGES;

  return (
    <div className='flex flex-col gap-3'>
      <div
        onDragOver={(e) => {
          if (e.dataTransfer.types.includes('Files')) {
            e.preventDefault();
            setDragOver(true);
          }
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          if (!e.dataTransfer.files.length) return;
          e.preventDefault();
          setDragOver(false);
          addFiles([...e.dataTransfer.files]);
        }}
        className={cn(
          'rounded-xl transition',
          dragOver && 'bg-secondary ring-2 ring-primary ring-offset-2'
        )}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId='images' direction='horizontal'>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className='flex flex-wrap gap-3'
              >
                {value.map((img, index) => (
                  <Draggable key={img.id} draggableId={img.id} index={index}>
                    {(p, snapshot) => (
                      <div
                        ref={p.innerRef}
                        {...p.draggableProps}
                        {...p.dragHandleProps}
                        className={cn(
                          'group relative h-28 w-28 overflow-hidden rounded-xl border bg-muted shadow-sm sm:h-32 sm:w-32',
                          snapshot.isDragging &&
                            'rotate-2 shadow-lift ring-2 ring-primary'
                        )}
                      >
                        <img
                          src={img.url}
                          alt=''
                          className='h-full w-full object-cover'
                          draggable={false}
                        />
                        {index === 0 && (
                          <span className='absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground'>
                            <Star className='h-3 w-3 fill-current' />{' '}
                            {t('upload.cover')}
                          </span>
                        )}
                        <button
                          type='button'
                          onClick={() => remove(img.id)}
                          aria-label={t('upload.remove')}
                          className='absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-100 transition hover:bg-black/80 sm:opacity-0 sm:group-hover:opacity-100'
                        >
                          <X className='h-4 w-4' />
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                {pending.map((p) => (
                  <div
                    key={p.key}
                    className='relative h-28 w-28 overflow-hidden rounded-xl border sm:h-32 sm:w-32'
                  >
                    <img
                      src={p.preview}
                      alt=''
                      className='h-full w-full object-cover opacity-50'
                    />
                    <Loader2 className='absolute inset-0 m-auto h-6 w-6 animate-spin text-primary' />
                  </div>
                ))}
                {canAdd && (
                  <button
                    type='button'
                    onClick={() => inputRef.current?.click()}
                    className={cn(
                      'flex h-28 w-28 flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed text-sm font-medium text-muted-foreground transition hover:border-primary hover:bg-secondary hover:text-primary sm:h-32 sm:w-32',
                      error
                        ? 'border-destructive/60 bg-destructive/5'
                        : 'border-input bg-card'
                    )}
                  >
                    <ImagePlus className='h-6 w-6' />
                    {t('upload.add')}
                  </button>
                )}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      <input
        ref={inputRef}
        type='file'
        accept='image/*'
        multiple
        hidden
        onChange={(e) => {
          addFiles([...(e.target.files ?? [])]);
          e.target.value = '';
        }}
      />
      {error ? (
        <p className='text-xs font-medium text-destructive' aria-live='polite'>
          {error}
        </p>
      ) : (
        <p className='text-xs text-muted-foreground'>
          {t('upload.hint', { max: MAX_IMAGES })}
        </p>
      )}
    </div>
  );
};
