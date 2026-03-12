import React from 'react';
import { Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

const InstagramSection = ({ handle, link, theme, previewImages = [], postLinks = [] }) => {
    const isDark = theme === 'dark';
    
    const sectionStyle = {
        padding: 'var(--space-6) 0',
        backgroundColor: isDark ? '#0A0A0A' : '#FAFAFA',
        color: isDark ? '#FFF' : '#222',
        borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
        textAlign: 'center'
    };

    const containerStyle = {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 var(--space-4)'
    };

    const buttonStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 24px',
        backgroundColor: isDark ? '#FFF' : '#222',
        color: isDark ? '#000' : '#FFF',
        textDecoration: 'none',
        borderRadius: 'var(--radius-full)',
        fontWeight: '600',
        marginTop: 'var(--space-4)',
        transition: 'transform 0.3s, opacity 0.3s'
    };

    // Simulated staggered post grid for aesthetics
    const placeholderPosts = [1, 2, 3, 4];
    
    return (
        <section style={sectionStyle} className="instagram-section">
            <div style={containerStyle}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <Instagram size={32} style={{ margin: '0 auto var(--space-2)' }} />
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '8px' }}>Únete a nuestra comunidad</h2>
                    <p style={{ opacity: 0.7, marginBottom: 'var(--space-4)' }}>@{handle}</p>
                </motion.div>

                <div className={postLinks.length > 0 ? "ig-grid-embeds" : "ig-grid"}>
                    {postLinks.length > 0 ? (
                        postLinks.map((url, index) => {
                            // Normalizar la URL para asegurar que termina en /embed
                            const baseUrl = url.split('?')[0].replace(/\/$/, "");
                            const embedUrl = `${baseUrl}/embed`;
                            
                            return (
                                <motion.div 
                                    key={`embed-${index}`} 
                                    className="ig-embed-wrapper"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <iframe 
                                        src={embedUrl}
                                        className="ig-iframe"
                                        frameBorder="0" 
                                        scrolling="no" 
                                        allowtransparency="true"
                                        title={`Instagram Post ${index}`}
                                    ></iframe>
                                </motion.div>
                            );
                        })
                    ) : (
                        previewImages.map((src, index) => (
                            <motion.a 
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                key={index} 
                                className="ig-post"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <img src={src} alt={`Instagram ${handle}`} className="ig-image-bg" />
                                <div className="ig-overlay">
                                    <Instagram size={24} className="ig-overlay-icon" />
                                </div>
                            </motion.a>
                        ))
                    )}
                </div>

                <motion.a 
                    href={link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={buttonStyle}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Instagram size={18} />
                    Síguenos en Instagram
                </motion.a>
            </div>

            <style>{`
                .ig-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: var(--space-2);
                    margin: var(--space-5) 0;
                }
                
                .ig-post {
                    aspect-ratio: 1;
                    background-color: ${isDark ? '#222' : '#EAEAEA'};
                    border-radius: var(--radius-sm);
                    position: relative;
                    overflow: hidden;
                    cursor: pointer;
                    display: block;
                }

                .ig-image-bg {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.5s ease;
                }

                .ig-post:hover .ig-image-bg {
                    transform: scale(1.05);
                }

                .ig-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(0,0,0,0.4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.3s;
                }

                .ig-overlay-icon {
                    color: white;
                    transform: scale(0.8);
                    transition: transform 0.3s;
                }

                .ig-post:hover .ig-overlay {
                    opacity: 1;
                }
                
                .ig-post:hover .ig-overlay-icon {
                    transform: scale(1);
                }

                @media (max-width: 768px) {
                    .ig-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    .ig-grid-embeds {
                        grid-template-columns: 1fr;
                    }
                }
                
                .ig-grid-embeds {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: var(--space-4);
                    margin: var(--space-5) auto;
                    width: 100%;
                }
                
                .ig-embed-wrapper {
                    background-color: ${isDark ? '#050505' : '#FFFFFF'};
                    border-radius: var(--item-radius);
                    overflow: hidden;
                    border: 1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
                    position: relative;
                    /* Aspect ratio container trick to force the iframe to fit nicely */
                    width: 100%;
                    min-width: 0;
                    padding-bottom: 140%; /* Relación de aspecto más alta para acomodar el header + footer de IG */
                }
                
                .ig-iframe {
                    position: absolute;
                    top: -1px; /* Ocultar el mini borde superior nativo de IG */
                    left: 0;
                    width: 100%;
                    height: calc(100% + 2px); 
                    border: none;
                    background: transparent;
                }
            `}</style>
        </section>
    );
};

export default InstagramSection;
