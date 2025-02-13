import admin from "firebase-admin";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

    const { email, attending } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const db = admin.firestore();
    const guestRef = db.collection("guests").where("email", "==", email);
    const guestSnapshot = await guestRef.get();

    if (guestSnapshot.empty) return res.status(404).json({ message: "Guest not found" });

    const guestId = guestSnapshot.docs[0].id;
    await db.collection("guests").doc(guestId).update({ attending });

    res.status(200).json({ message: "RSVP confirmed!" });
}
