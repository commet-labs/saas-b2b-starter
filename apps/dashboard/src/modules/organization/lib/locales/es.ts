export const organizationLocales = {
  organization: {
    title: "Configuración de Organización",
    description:
      "Administra la información y configuración de tu organización.",
    create: {
      title: "Crear tu primera organización",
      description:
        "Para comenzar, necesitas crear una organización donde gestionar tus proyectos y facturación.",
      form: {
        name: {
          label: "Nombre de la organización",
          placeholder: "Mi empresa",
        },

        submit: "Crear organización",
        submitting: "Creando...",
      },
      validation: {
        name: {
          required: "El nombre de la organización es requerido",
          maxLength:
            "El nombre de la organización debe tener menos de 50 caracteres",
        },
        slug: {
          required: "El slug de la organización es requerido",
          maxLength:
            "El slug de la organización debe tener menos de 48 caracteres",
          format: "Solo se permiten letras minúsculas, números y guiones",
        },
      },
      messages: {
        success: "Organización creada exitosamente",
        error: "Error al crear la organización",
        slugTaken: "Este slug ya está en uso. Por favor elige uno diferente.",
        redirecting:
          "Una vez creada, serás redirigido automáticamente al dashboard de tu organización.",
      },
    },
    name: {
      title: "Nombre de la Organización",
      description:
        "Este es el nombre visible de tu organización. Por ejemplo, el nombre de tu empresa o departamento.",
      form: {
        label: "Nombre de la Organización",
        placeholder: "Ingresa el nombre de tu organización",
        validation: {
          required: "El nombre de la organización es requerido",
          maxLength:
            "El nombre de la organización debe tener menos de 32 caracteres",
        },
      },
      submit: "Guardar Nombre",
      submitting: "Guardando...",
      footer: "Por favor usa máximo 32 caracteres.",
    },
    slug: {
      title: "URL de la Organización",
      description:
        "Este es el namespace de URL de tu organización. Dentro de él, tu equipo puede inspeccionar sus proyectos, revisar actividad reciente, o configurar ajustes a su gusto.",
      form: {
        label: "URL de la Organización",
        placeholder: "tu-organizacion",
        validation: {
          required: "La URL de la organización es requerida",
          maxLength:
            "La URL de la organización debe tener menos de 48 caracteres",
          format:
            "La URL solo puede contener letras minúsculas, números y guiones",
        },
      },
      submit: "Guardar URL",
      submitting: "Guardando...",
      footer: "Por favor usa máximo 48 caracteres.",
      prefix: "commet.co/",
    },
    logo: {
      title: "Avatar de la Organización",
      description:
        "Este es el avatar de tu organización. Haz clic en el avatar para subir uno personalizado desde tus archivos.",
      form: {
        validation: {
          invalidUrl: "Por favor proporciona una URL válida para el logo",
        },
      },
      submit: "Guardar Avatar",
      submitting: "Guardando...",
      uploading: "Subiendo imagen...",
      footer: "Un avatar es opcional pero muy recomendado.",
    },
    delete: {
      title: "Eliminar Organización",
      description:
        "Eliminar permanentemente tu organización y todo su contenido de la plataforma. Esta acción no es reversible, así que por favor continúa con precaución.",
      footer: "Esta acción no se puede deshacer.",
      button: "Eliminar Organización",
      dialog: {
        title: "Eliminar Organización",
        description:
          "Esto eliminará permanentemente la organización y todos los datos asociados. Esta acción no se puede deshacer.",
        form: {
          confirmation: {
            label: 'Escribe "eliminar mi organización" para confirmar:',
            placeholder: "eliminar mi organización",
            text: "eliminar mi organización",
          },
          organizationName: {
            label:
              "Escribe el nombre de la organización ({name}) para confirmar:",
          },
          cancel: "Cancelar",
          delete: "Eliminar Organización",
          deleting: "Eliminando...",
          validation: {
            confirmation:
              'Debes escribir "eliminar mi organización" para confirmar',
            organizationName: "El nombre de la organización es requerido",
          },
        },
      },
    },
    messages: {
      nameUpdateSuccess: "Nombre de la organización actualizado exitosamente",
      slugUpdateSuccess: "URL de la organización actualizada exitosamente",
      logoUpdateSuccess: "Avatar de la organización actualizado exitosamente",
      deleteSuccess: "Organización eliminada exitosamente",
      error: "Error al actualizar la organización. Por favor intenta de nuevo.",
      unauthorized:
        "No tienes permisos para modificar la configuración de la organización",
      slugUnauthorized:
        "Solo los propietarios de la organización pueden cambiar la URL",
      deleteUnauthorized:
        "Solo los propietarios de la organización pueden eliminar la organización",
      slugTaken: "Esta URL ya está siendo utilizada por otra organización",
      nameDoesNotMatch: "El nombre de la organización no coincide",
    },
    billing: {
      title: "Configuración de Facturación",
      description:
        "Configura cómo tu organización maneja la facturación de eventos de uso y cambios de licencias.",
      billingTimezoneStrategy: {
        title: "Estrategia de Zona Horaria",
        description:
          "Qué zona horaria usar al calcular límites de períodos de facturación (ej: 1-31 Ene).",
        tooltip:
          "Esto determina cuándo comienza/termina un día de facturación. Zona horaria del cliente es más precisa pero operacionalmente compleja. UTC es más simple pero puede desalinearse con expectativas del cliente.",
        options: {
          customer_timezone: {
            label: "Zona Horaria del Cliente (Predeterminado)",
            description:
              "Facturar a medianoche en zona horaria de cada cliente - más preciso pero operacionalmente complejo",
          },
          organization_timezone: {
            label: "Zona Horaria de la Organización",
            description:
              "Facturar a medianoche en zona horaria de tu organización - operaciones más simples, hora uniforme",
          },
        },
      },
      lateEventsPolicy: {
        title: "Política de Eventos Tardíos",
        description:
          "Cómo manejar eventos de uso que llegan después de cerrado el período de facturación.",
        tooltip:
          "Los eventos pueden llegar tarde por retrasos de red, reintentos o procesamiento en lote. Esta política determina cómo facturarlos.",
        options: {
          next_period: {
            label: "Facturar en Próximo Período (Predeterminado)",
            description:
              "Los eventos tardíos se incluyen en el siguiente período de facturación (predeterminado)",
          },
          current_period: {
            label: "Facturar en Período Actual",
            description:
              "Los eventos tardíos generan facturas complementarias para el período cerrado",
          },
          ignore: {
            label: "Ignorar Eventos Tardíos",
            description: "Los eventos tardíos se descartan y no se facturan",
          },
        },
      },
      seatProrationStrategy: {
        title: "Precisión del Prorrateo de Licencias",
        description:
          "Cuán precisamente calcular cargos cuando la cantidad de licencias cambia a mitad de ciclo.",
        tooltip:
          "Determina la granularidad del promedio ponderado por tiempo para cambios de licencias. Mayor precisión significa facturación más justa pero cálculos más complejos.",
        options: {
          daily: {
            label: "Prorrateo Diario (Predeterminado)",
            description: "Calcular cargos por día (recomendado)",
          },
          hourly: {
            label: "Prorrateo por Hora",
            description: "Calcular cargos por hora (máxima precisión)",
          },
          none: {
            label: "Sin Prorrateo",
            description:
              "Cobrar basado en el conteo final de licencias por el período completo",
          },
        },
      },
      seatProrationDirection: {
        title: "Dirección del Prorrateo de Licencias",
        description:
          "Si prorratear cargos cuando las licencias aumentan, disminuyen, o ambos.",
        tooltip:
          "Controla si los clientes reciben créditos por licencias removidas o solo pagan proporcionalmente por licencias agregadas.",
        options: {
          both: {
            label: "Prorratear en Ambos Sentidos (Predeterminado)",
            description:
              "Prorratear cargos tanto para aumentos como disminuciones",
          },
          up_only: {
            label: "Solo Prorratear Aumentos",
            description:
              "Prorratear al agregar licencias, sin reembolsos al remover (como GitHub)",
          },
          none: {
            label: "Sin Prorrateo",
            description:
              "Cobrar período completo sin importar cuándo ocurran los cambios",
          },
        },
      },
      seatRoundingPolicy: {
        title: "Política de Redondeo de Licencias",
        description:
          "Cómo redondear los cargos prorrateados de licencias cuando el resultado es decimal.",
        tooltip:
          "Determina el comportamiento de redondeo para cargos fraccionarios de licencias. Afecta los ingresos y la percepción del cliente.",
        options: {
          round_nearest: {
            label: "Redondear al Más Cercano (Predeterminado)",
            description: "Redondear al centavo más cercano (más justo)",
          },
          round_up: {
            label: "Redondear Hacia Arriba",
            description:
              "Siempre redondear hacia arriba (favorece tus ingresos)",
          },
          round_down: {
            label: "Redondear Hacia Abajo",
            description: "Siempre redondear hacia abajo (favorece al cliente)",
          },
        },
      },
      messages: {
        timezoneUpdateSuccess:
          "Estrategia de zona horaria actualizada exitosamente",
        lateEventsUpdateSuccess:
          "Política de eventos tardíos actualizada exitosamente",
        roundingUpdateSuccess:
          "Política de redondeo de licencias actualizada exitosamente",
        prorationStrategyUpdateSuccess:
          "Estrategia de prorrateo de licencias actualizada exitosamente",
        prorationDirectionUpdateSuccess:
          "Dirección de prorrateo de licencias actualizada exitosamente",
        error:
          "Error al actualizar configuración de facturación. Por favor intenta de nuevo.",
        unauthorized:
          "No tienes permisos para modificar la configuración de facturación",
      },
    },
  },
} as const;
