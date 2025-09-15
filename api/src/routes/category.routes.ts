import { Router } from 'express'
import { listCategories, getCategory, upsertCategory, deleteCategory } from '../controllers/category.controller'

const router = Router()

router.get('/', listCategories)
router.get('/:title', getCategory)
router.post('/', upsertCategory)
router.put('/:title', upsertCategory)
router.delete('/:title', deleteCategory)

export default router


