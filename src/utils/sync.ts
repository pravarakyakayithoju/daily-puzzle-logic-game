import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getAllActivity, saveDailyActivity, clearAllActivity } from "../db/dailyActivity";

export const syncActivity = async (uid: string) => {
    if (!uid) return;

    const userRef = doc(db, "users", uid);
    const docSnap = await getDoc(userRef);

    // 1. Fetch remote data
    let remoteData: Record<string, any> = {};
    if (docSnap.exists()) {
        remoteData = docSnap.data().history || {};
    }

    // 2. Fetch local data
    const localActivities = await getAllActivity();
    const localMap: Record<string, any> = {};
    localActivities.forEach((a) => {
        localMap[a.date] = a;
    });

    // 3. Merge: Remote wins if not present locally, or merge logic if needed
    // Ideally, we want the union of solved days.
    // If conflict, solved=true wins.

    const mergedMap = { ...remoteData, ...localMap };

    // Also update remote with local if local has something new
    // This is a simplified two-way sync. ideally we track timestamps.
    // For now, we just save the merged result back to BOTH.

    const mergedList = Object.values(mergedMap);

    // Save to Local
    await clearAllActivity();
    for (const activity of mergedList) {
        await saveDailyActivity(activity as any);
    }

    // Save to Remote
    await setDoc(userRef, { history: mergedMap }, { merge: true });
};
