'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './paste.module.css';

export default function PasteDemoPage() {
  return (
    <div className={styles.pasteContainer}>
      <div className={styles.pasteCard}>
        {/* Póster de la película */}
        <div className={styles.posterSection}>
          {/* Usamos un placeholder de imagen para la demo */}
          <img 
            src="https://image.tmdb.org/t/p/w600_and_h900_bestv2/8cdWjvZQUrmU1b4p9eZ237ZosP1.jpg" 
            alt="Deadpool & Wolverine Poster" 
            className={styles.posterImage}
          />
        </div>

        {/* Contenido y Enlaces */}
        <div className={styles.contentSection}>
          <h1 className={styles.title}>Deadpool & Wolverine</h1>
          
          <div className={styles.metadata}>
            <span className={styles.badge}>2024</span>
            <span>Acción, Comedia, Ciencia ficción</span>
            <span>2h 8m</span>
          </div>

          <h2 className={styles.downloadOptionsTitle}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Enlaces de Descarga
          </h2>

          <div className={styles.optionsList}>
            
            {/* Opción 4K */}
            <div className={styles.optionCard}>
              <div className={styles.optionInfo}>
                <div className={styles.qualityRow}>
                  <span className={styles.quality}>4K UHD</span>
                  <span className={styles.langBadge}>Latino / Inglés</span>
                </div>
                <div className={styles.details}>
                  <span className={styles.server}>
                    Mega
                  </span>
                  <span>•</span>
                  <span className={styles.size}>14.5 GB</span>
                  <span>•</span>
                  <span>MKV</span>
                </div>
              </div>
              <button className={styles.downloadBtn} onClick={() => alert('¡Iniciando descarga de prueba!')}>
                Descargar
              </button>
            </div>

            {/* Opción 1080p */}
            <div className={styles.optionCard}>
              <div className={styles.optionInfo}>
                <div className={styles.qualityRow}>
                  <span className={styles.quality}>1080p HD</span>
                  <span className={styles.langBadge}>Latino</span>
                </div>
                <div className={styles.details}>
                  <span className={styles.server}>
                    MediaFire
                  </span>
                  <span>•</span>
                  <span className={styles.size}>3.2 GB</span>
                  <span>•</span>
                  <span>MP4</span>
                </div>
              </div>
              <button className={styles.downloadBtn} onClick={() => alert('¡Iniciando descarga de prueba!')}>
                Descargar
              </button>
            </div>

            {/* Opción 720p */}
            <div className={styles.optionCard}>
              <div className={styles.optionInfo}>
                <div className={styles.qualityRow}>
                  <span className={styles.quality}>720p</span>
                  <span className={styles.langBadge}>Latino</span>
                </div>
                <div className={styles.details}>
                  <span className={styles.server}>
                    Google Drive
                  </span>
                  <span>•</span>
                  <span className={styles.size}>1.5 GB</span>
                  <span>•</span>
                  <span>MP4</span>
                </div>
              </div>
              <button className={styles.downloadBtnOutline} onClick={() => alert('¡Iniciando descarga de prueba!')}>
                Descargar
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
