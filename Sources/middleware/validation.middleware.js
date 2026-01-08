// xử lý lệnh trong validator
//vd validator có :
// export const registerSchema = z.object({
//     name: z.string().min(3),
//     email: z.string().email(),
//     password: z.string().min(6),
//     phone: z.string().optional(),
//     role: z.enum(["User", "Admin"]).default("User")
//   });
// thì validation trong middleware xử lý như sau:
// export function validate(schema) {
//     return (req, res, next) => {
//       try {
//         schema.parse(req.body);
//         next();
//       } catch (err) {
//         res.status(400).json({
//           message: "Validation error",
//           errors: err.errors
//         });
//       }
//     };
//   }
  
  