# Mini-Saas-Multi-Negocio

Sistema de gestión de órdenes con soporte multi-tenant.
Tecnologías: NestJS, Angular, Prisma.

Objetivo: demostrar arquitectura limpia, separación por negocio y control de acceso.

<strong>
Authentication
</strong>

This project uses Clerk for authentication and session management.
Clerk is responsible only for identity, while the backend maintains its own user domain, roles and multi-tenant business logic.

This separation reflects a real-world SaaS architecture
