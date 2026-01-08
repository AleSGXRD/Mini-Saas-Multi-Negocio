# Mini-Saas-Multi-Tenant

Order management system with multi-tenant support.

Technologies: NestJS, Angular, Prisma.

Objective: To demonstrate clean architecture, business separation, and access control.

<strong>
Authentication
</strong>

This project uses Clerk for authentication and session management.
Clerk is responsible only for identity, while the backend maintains its own user domain, roles and multi-tenant business logic.

This separation reflects a real-world SaaS architecture
