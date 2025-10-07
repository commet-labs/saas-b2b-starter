export const authLocales = {
  login: {
    title: "Bienvenido de vuelta",
    description: "Inicia sesión con tu cuenta de Google o usa un enlace mágico",
    googleButton: "Iniciar sesión con Google",
    googleButtonLoading: "Iniciando sesión...",
    orContinue: "O continúa con",
    emailLabel: "Email",
    emailPlaceholder: "m@ejemplo.com",
    emailError: "Por favor ingresa una dirección de email válida",
    sendMagicLink: "Enviar Enlace Mágico",
    sendingMagicLink: "Enviando...",
    magicLinkSent: "¡Revisa tu email por un enlace mágico!",
    magicLinkSentTitle: "¡Enlace mágico enviado!",
    magicLinkSentDescription:
      "Revisa tu email y haz clic en el enlace para iniciar sesión",
    sendAnotherLink: "Enviar otro enlace",
    googleError: "Error al iniciar sesión con Google",
    magicLinkError: "Error al enviar el enlace mágico",
    termsText: "Al hacer clic en continuar, aceptas nuestros",
    termsLink: "Términos de Servicio",
    privacyLink: "Política de Privacidad",
  },
  invitation: {
    error: {
      title: "Error al Aceptar Invitación",
      message:
        "No se pudo aceptar la invitación. Puede que haya expirado o ya haya sido utilizada.",
      contact:
        "Si crees que esto es un error, contacta a la persona que te envió la invitación.",
    },
  },
} as const;
