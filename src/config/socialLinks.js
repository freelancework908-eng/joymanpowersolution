/**
 * Joy Manpower Solution - Social Media Links Configuration
 * Centralized configuration for all external company social profiles.
 * Links with empty or null URLs will be automatically hidden from the UI.
 */

export const socialConfig = {
  whatsapp: {
    name: 'WhatsApp',
    url: 'https://wa.me/919876543210?text=Hello%20Joy%20Manpower%20Solution,%20I%20am%20inquiring%20about%20overseas%20job%20vacancies%20in%20Dubai%20and%20Saudi%20Arabia.',
    ariaLabel: 'Chat with Joy Manpower Solution on WhatsApp',
    tooltip: 'Chat on WhatsApp',
    isProminent: true,
    brandColor: '#25D366',
    hoverBg: 'hover:bg-[#20bd5a]'
  },
  facebook: {
    name: 'Facebook',
    url: 'https://www.facebook.com/joymanpowersolution',
    ariaLabel: 'Visit Joy Manpower Solution on Facebook',
    tooltip: 'Follow on Facebook',
    isProminent: false,
    brandColor: '#1877F2',
    hoverBg: 'hover:bg-[#166fe5]'
  },
  instagram: {
    name: 'Instagram',
    url: 'https://www.instagram.com/joymanpowersolution',
    ariaLabel: 'Follow Joy Manpower Solution on Instagram',
    tooltip: 'Follow on Instagram',
    isProminent: false,
    brandColor: '#E4405F',
    hoverBg: 'hover:bg-[#d6294a]'
  },
  youtube: {
    name: 'YouTube',
    url: 'https://www.youtube.com/@joymanpowersolution',
    ariaLabel: 'Subscribe to Joy Manpower Solution on YouTube',
    tooltip: 'Watch on YouTube',
    isProminent: false,
    brandColor: '#FF0000',
    hoverBg: 'hover:bg-[#e60000]'
  }
}

/**
 * Returns an array of only available, valid social media links.
 */
export const getActiveSocialLinks = () => {
  return Object.entries(socialConfig)
    .filter(([_, item]) => Boolean(item && item.url && item.url.trim().length > 0))
    .map(([key, item]) => ({
      id: key,
      ...item
    }))
}
