'use server'

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

const MAINTENANCE_ID = 'SYS_MAINTENANCE_MODE';

export async function getMaintenanceStatus() {
  const { data, error } = await supabase
    .from('Movie')
    .select('title')
    .eq('id', MAINTENANCE_ID)
    .single();

  if (error || !data) return { active: false, message: '' };
  return { active: true, message: data.title || '' };
}

export async function toggleMaintenanceMode(active: boolean, message: string = '') {
  if (active) {
    // Activar: Crear o actualizar el registro oculto en la base de datos
    const { error } = await supabase.from('Movie').upsert({
      id: MAINTENANCE_ID,
      title: message,
      coverUrl: 'maintenance',
      downloadUrl: 'maintenance',
      type: 'system_config',
      synopsis: 'Configuración interna de mantenimiento global',
    }, { onConflict: 'id' });

    if (error) throw new Error(error.message);
  } else {
    // Desactivar: Borrar el registro
    const { error } = await supabase.from('Movie').delete().eq('id', MAINTENANCE_ID);
    if (error) throw new Error(error.message);
  }

  // Refrescar la caché global para que el cambio surta efecto de inmediato
  revalidatePath('/', 'layout');
}
