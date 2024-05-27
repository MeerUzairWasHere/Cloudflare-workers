import { Hono, Next } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { env } from 'hono/adapter';

const app = new Hono();

app.get('/', async (c) => {
	// Todo add zod validation here

	const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);

	const prisma = new PrismaClient({
		datasourceUrl: DATABASE_URL || 'prisma://your-database-url',
	}).$extends(withAccelerate());

	const users = await prisma.user.findMany({});
	const usersCount = await prisma.user.count({});
	return c.json({ usersCount, users });
});
app.post('/', async (c) => {
	// Todo add zod validation here
	const body: {
		name: string;
		email: string;
		password: string;
	} = await c.req.json();
	const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);

	const prisma = new PrismaClient({
		datasourceUrl:
			DATABASE_URL ||
			'prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiNDJiZGU1OTItMWYyOC00MzkwLWIxMGEtZWVhODc0OTczY2M0IiwidGVuYW50X2lkIjoiNzkzM2JlOWM1ZmI3MTQ5NzRjM2ZlZWI4YzFmZDk4NjQ5NThkMDBjOTlkNTAzNGQ5OTJlMzZhNGUxNDBiNGRjOSIsImludGVybmFsX3NlY3JldCI6ImFhYTllNGQ4LWQ1OGQtNGQyOC05YzZlLThkZjZhMjY5OWU0YiJ9.jpIOg_q-7cdnzImrXMDPRp3r_CJFM_w3Yw0vquCU1ec',
	}).$extends(withAccelerate());

	console.log(body);

	await prisma.user.create({
		data: {
			name: body.name,
			email: body.email,
			password: body.password,
		},
	});

	return c.json({ msg: 'User created!' });
});

export default app;
