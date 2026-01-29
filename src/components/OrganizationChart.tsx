import React from 'react';
import { useState, useRef, useEffect, useCallback } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

interface OrganizationChartProps {
    // No props needed - will be managed by App.tsx routing
}

const OrganizationChart: React.FC<OrganizationChartProps> = () => {
    const [orgMembers, setOrgMembers] = useState([])
    const [draggedMember, setDraggedMember] = useState(null)
    const [dragOverMember, setDragOverMember] = useState(null)
    const [memberPositions, setMemberPositions] = useState({})
    const [chartImage, setChartImage] = useState(null)
    const [chartStyle, setChartStyle] = useState('modern') // modern, classic, minimal, colorful, professional, twolevel, threelevel, fourlevel, colorcoded, wiring, pid, circuit, mechanical, photo, horizontal, company, nonprofit, corporate, hospital, hr, school
    const [paperSize, setPaperSize] = useState('A4') // A4, A3, Legal
    const [orientation, setOrientation] = useState('landscape') // portrait, landscape
    const chartContainerRef = useRef(null)
    const fileInputRef = useRef(null)
    const isPositionDraggingRef = useRef(false)

    // Load from localStorage on mount
    useEffect(() => {
        const savedMembers = localStorage.getItem('organizationChartMembers')
        const savedPositions = localStorage.getItem('organizationChartPositions')
        const savedChartImage = localStorage.getItem('organizationChartImage')
        const savedChartStyle = localStorage.getItem('organizationChartStyle')
        const savedPaperSize = localStorage.getItem('organizationChartPaperSize')
        const savedOrientation = localStorage.getItem('organizationChartOrientation')
        
        if (savedMembers) {
            try {
                const loadedMembers = JSON.parse(savedMembers)
                setOrgMembers(loadedMembers)
            } catch (error) {
                console.error('Error loading organization chart members:', error)
            }
        }
        
        if (savedPositions) {
            try {
                const loadedPositions = JSON.parse(savedPositions)
                setMemberPositions(loadedPositions)
            } catch (error) {
                console.error('Error loading member positions:', error)
            }
        }
        
        if (savedChartImage) {
            setChartImage(savedChartImage)
        }
        
        if (savedChartStyle) {
            setChartStyle(savedChartStyle)
        }
        
        if (savedPaperSize) {
            setPaperSize(savedPaperSize)
        }
        
        if (savedOrientation) {
            setOrientation(savedOrientation)
        }
    }, [])

    // Save to localStorage whenever data changes
    useEffect(() => {
        localStorage.setItem('organizationChartMembers', JSON.stringify(orgMembers))
    }, [orgMembers])

    useEffect(() => {
        localStorage.setItem('organizationChartPositions', JSON.stringify(memberPositions))
    }, [memberPositions])

    useEffect(() => {
        if (chartImage) {
            localStorage.setItem('organizationChartImage', chartImage)
        } else {
            localStorage.removeItem('organizationChartImage')
        }
    }, [chartImage])

    useEffect(() => {
        localStorage.setItem('organizationChartStyle', chartStyle)
    }, [chartStyle])

    useEffect(() => {
        localStorage.setItem('organizationChartPaperSize', paperSize)
    }, [paperSize])

    useEffect(() => {
        localStorage.setItem('organizationChartOrientation', orientation)
    }, [orientation])

    // Initialize positions for new members
    useEffect(() => {
        orgMembers.forEach(member => {
            if (!memberPositions[member.id]) {
                setMemberPositions(prev => ({
                    ...prev,
                    [member.id]: {
                        x: Math.random() * 300 + 100,
                        y: Math.random() * 200 + 100
                    }
                }))
            }
        })
    }, [orgMembers.length])

    const addMember = () => {
        const newMember = {
            id: Date.now(),
            name: '',
            role: '',
            phone: '',
            email: '',
            parentId: null,
            photo: null
        }
        setOrgMembers([...orgMembers, newMember])
        setMemberPositions(prev => ({
            ...prev,
            [newMember.id]: {
                x: Math.random() * 300 + 100,
                y: Math.random() * 200 + 100
            }
        }))
    }

    const handleImportFromData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
            try {
                const text = event.target?.result as string
                let importedMembers: any[] = []

                // Try to parse as JSON first
                try {
                    const data = JSON.parse(text)
                    // Check if it's an array or has a members property
                    importedMembers = Array.isArray(data) ? data : (data.members || [])
                } catch {
                    // If JSON fails, try CSV parsing
                    const lines = text.split('\n').filter(line => line.trim())
                    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
                    
                    for (let i = 1; i < lines.length; i++) {
                        const values = lines[i].split(',').map(v => v.trim())
                        const member: any = {
                            id: Date.now() + i,
                            name: '',
                            role: '',
                            phone: '',
                            email: '',
                            parentId: null,
                            photo: null,
                            parentName: null
                        }
                        
                        headers.forEach((header, index) => {
                            const value = values[index] || ''
                            if (header.includes('name')) member.name = value
                            else if (header.includes('role') || header.includes('designation') || header.includes('title')) member.role = value
                            else if (header.includes('phone') || header.includes('contact')) member.phone = value
                            else if (header.includes('email')) member.email = value
                            else if (header.includes('parent') || header.includes('reports')) {
                                // Try to find parent by name
                                const parentName = value
                                if (parentName) {
                                    // Will be resolved after all members are imported
                                    member.parentName = parentName
                                }
                            }
                        })
                        
                        importedMembers.push(member)
                    }
                }

                // Process imported members
                if (importedMembers.length > 0) {
                    interface ProcessedMember {
                        id: string | number
                        name: string
                        role: string
                        phone: string
                        email: string
                        parentId: string | null
                        parentName?: string | null
                        photo: string | null
                    }

                    const processedMembers: ProcessedMember[] = importedMembers.map((member: any, index: number) => ({
                        id: member.id || Date.now() + index,
                        name: member.name || '',
                        role: member.role || member.designation || '',
                        phone: member.phone || member.contact || '',
                        email: member.email || '',
                        parentId: null as string | null, // Will be resolved below
                        parentName: member.parentName || member.parent || member.reportsTo || null,
                        photo: member.photo || null
                    }))

                    // Resolve parent relationships by name
                    const nameToIdMap = new Map<string, string | number>()
                    processedMembers.forEach(m => {
                        if (m.name) nameToIdMap.set(m.name.toLowerCase(), m.id)
                    })

                    processedMembers.forEach(member => {
                        if (member.parentName) {
                            const parentId = nameToIdMap.get(member.parentName.toLowerCase())
                            if (parentId) {
                                member.parentId = parentId as string
                            }
                        }
                        delete member.parentName
                    })

                    // Add imported members to existing members
                    // Remove parentName before adding to state
                    const finalMembers = processedMembers.map(({ parentName, ...member }) => member)
                    setOrgMembers((prev: any[]) => [...prev, ...finalMembers])
                    
                    // Set positions for new members
                    processedMembers.forEach(member => {
                        setMemberPositions(prev => ({
                            ...prev,
                            [member.id]: {
                                x: Math.random() * 300 + 100,
                                y: Math.random() * 200 + 100
                            }
                        }))
                    })

                    alert(`Successfully imported ${processedMembers.length} member(s)!`)
                } else {
                    alert('No valid members found in the file.')
                }
            } catch (error) {
                console.error('Error importing data:', error)
                alert('Error importing data. Please check the file format.')
            }
        }
        reader.readAsText(file)
        
        // Reset file input
        e.target.value = ''
    }

    const handleMemberPhotoUpload = (memberId, file) => {
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                updateMember(memberId, 'photo', reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleChartImageUpload = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setChartImage(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const removeChartImage = () => {
        setChartImage(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    // Paper size dimensions in pixels (at 96 DPI)
    const getPaperDimensions = () => {
        const dimensions = {
            A4: { width: 794, height: 1123 }, // Portrait
            A3: { width: 1123, height: 1587 },
            Legal: { width: 816, height: 1344 }
        }

        const base = dimensions[paperSize]
        if (orientation === 'landscape') {
            return { width: base.height, height: base.width }
        }
        return base
    }

    // Paper size dimensions in mm for PDF
    const getPaperDimensionsMm = () => {
        const dimensions = {
            A4: { width: 210, height: 297 }, // Portrait in mm
            A3: { width: 297, height: 420 },
            Legal: { width: 216, height: 356 }
        }

        const base = dimensions[paperSize]
        if (orientation === 'landscape') {
            return { width: base.height, height: base.width }
        }
        return base
    }

    // Render chart to canvas with high quality
    const renderChartToCanvas = async (dpi = 300, forPrint = false) => {
        const styleBackups: Map<HTMLElement, string> = new Map()
        
        try {
            if (!chartContainerRef.current) {
                throw new Error('Chart container not found')
            }

            // Pre-process: Convert all computed styles to inline styles to avoid oklch issues
            // This must happen BEFORE html2canvas processes the element
            const allElements = chartContainerRef.current.querySelectorAll('*')
            
            allElements.forEach((el) => {
                const element = el as HTMLElement
                const computedStyle = window.getComputedStyle(element)
                
                // Backup original style
                styleBackups.set(element, element.getAttribute('style') || '')
                
                // Convert color properties to inline styles (browser converts oklch to rgb)
                const colorProps = ['color', 'backgroundColor', 'borderColor', 
                    'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor']
                
                colorProps.forEach(prop => {
                    try {
                        const value = computedStyle.getPropertyValue(prop)
                        if (value && 
                            value.trim() !== '' &&
                            value !== 'transparent' &&
                            !value.toLowerCase().includes('oklch')) {
                            element.style.setProperty(prop, value, 'important')
                        }
                    } catch (e) {
                        // Ignore errors
                    }
                })
            })

            // html2canvas uses 96 DPI as base resolution
            const baseDpi = 96
            const scale = dpi / baseDpi

            // For print/PDF, use higher scale (minimum 2x, up to 4x for 300+ DPI)
            const finalScale = forPrint ? Math.max(2, Math.min(scale, 4)) : Math.min(scale, 2)

            const options = {
                scale: finalScale,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#f9fafb', // gray-50 background
                width: chartContainerRef.current.scrollWidth,
                height: chartContainerRef.current.scrollHeight,
                logging: false,
                windowWidth: chartContainerRef.current.scrollWidth,
                windowHeight: chartContainerRef.current.scrollHeight,
                removeContainer: false,
                imageTimeout: 15000,
                foreignObjectRendering: false, // Disable foreign object rendering to avoid oklch issues
                onclone: (clonedDoc) => {
                    // Inject a style that will override any oklch colors with safe fallbacks
                    // This must be done first, before other processing
                    const overrideStyle = clonedDoc.createElement('style')
                    overrideStyle.id = 'oklch-override'
                    overrideStyle.textContent = `
                        /* Override any oklch colors with safe fallbacks */
                        * {
                            /* Force all color properties to use computed rgb values */
                        }
                    `
                    clonedDoc.head.insertBefore(overrideStyle, clonedDoc.head.firstChild)
                    
                    // Hide any UI elements that shouldn't be in export
                    const clonedElement = clonedDoc.querySelector('[ref]') || clonedDoc.body
                    if (clonedElement) {
                        // Remove any hover effects or temporary elements
                        const hoverElements = clonedElement.querySelectorAll('.opacity-0, .group-hover\\:opacity-100')
                        hoverElements.forEach(el => {
                            if (el.classList.contains('opacity-0')) {
                                el.style.display = 'none'
                            }
                        })
                    }
                    
                    // Remove or replace stylesheets that contain oklch colors
                    // html2canvas reads CSS rules directly, so we need to handle them aggressively
                    try {
                        const styleSheets = Array.from(clonedDoc.styleSheets || [])
                        const rulesToRemove: Array<{sheet: any, index: number}> = []
                        
                        styleSheets.forEach((sheet: any) => {
                            try {
                                if (!sheet.cssRules) return
                                const rules = Array.from(sheet.cssRules || [])
                                rules.forEach((rule: any, index: number) => {
                                    let hasOklch = false
                                    
                                    if (rule.style) {
                                        // Check and remove oklch in all style properties
                                        const style = rule.style
                                        const propsToRemove: string[] = []
                                        
                                        for (let i = 0; i < style.length; i++) {
                                            const prop = style[i]
                                            const value = style.getPropertyValue(prop)
                                            if (value && value.toLowerCase().includes('oklch')) {
                                                propsToRemove.push(prop)
                                                hasOklch = true
                                            }
                                        }
                                        
                                        // Remove properties that contain oklch
                                        propsToRemove.forEach(prop => {
                                            try {
                                                style.removeProperty(prop)
                                            } catch (e) {
                                                // Ignore errors
                                            }
                                        })
                                    }
                                    
                                    // Also check CSS text directly for oklch
                                    if (rule.cssText && rule.cssText.toLowerCase().includes('oklch')) {
                                        hasOklch = true
                                        // Mark rule for deletion
                                        rulesToRemove.push({ sheet, index })
                                    }
                                })
                            } catch (e) {
                                // Cross-origin stylesheets will throw errors, skip them
                            }
                        })
                        
                        // Delete rules that contain oklch (in reverse order to maintain indices)
                        rulesToRemove.sort((a, b) => b.index - a.index).forEach(({sheet, index}) => {
                            try {
                                if (sheet.deleteRule) {
                                    sheet.deleteRule(index)
                                }
                            } catch (e) {
                                // Ignore errors
                            }
                        })
                    } catch (e) {
                        // Silently continue if stylesheet processing fails
                    }
                    
                    // Process <style> tags in the document
                    const styleTags = clonedDoc.querySelectorAll('style')
                    styleTags.forEach((styleTag) => {
                        if (styleTag.textContent && styleTag.textContent.toLowerCase().includes('oklch')) {
                            // Remove oklch from style tag content
                            styleTag.textContent = styleTag.textContent.replace(/oklch\([^)]+\)/gi, 'transparent')
                        }
                    })
                    
                    // Also check and clean inline styles that might contain oklch
                    const allElementsWithStyles = clonedDoc.querySelectorAll('[style]')
                    allElementsWithStyles.forEach((el) => {
                        const element = el as HTMLElement
                        const inlineStyle = element.getAttribute('style')
                        if (inlineStyle && inlineStyle.toLowerCase().includes('oklch')) {
                            // Remove oklch from inline styles - replace with transparent or a safe color
                            const cleanedStyle = inlineStyle
                                .replace(/oklch\([^)]+\)/gi, 'transparent')
                                .replace(/background[^:]*:\s*oklch\([^)]+\)/gi, 'background: transparent')
                                .replace(/color:\s*oklch\([^)]+\)/gi, 'color: #000000')
                            element.setAttribute('style', cleanedStyle)
                        }
                    })
                    
                    // Get the window reference first
                    const win = clonedDoc.defaultView || (clonedDoc as any).parentWindow || window
                    
                    // Process CSS custom properties (variables) that might contain oklch
                    const rootElement = clonedDoc.documentElement || clonedDoc.querySelector('html')
                    if (rootElement) {
                        try {
                            const rootStyle = win.getComputedStyle(rootElement)
                            // Process CSS variables in the cloned document's stylesheets
                            const clonedStyleSheets = Array.from(clonedDoc.styleSheets || [])
                            clonedStyleSheets.forEach((sheet: any) => {
                                try {
                                    if (!sheet.cssRules) return
                                    const rules = Array.from(sheet.cssRules || [])
                                    rules.forEach((rule: any) => {
                                        if (rule.selectorText === ':root' && rule.style) {
                                            for (let i = 0; i < rule.style.length; i++) {
                                                const prop = rule.style[i]
                                                if (prop.startsWith('--')) {
                                                    const value = rule.style.getPropertyValue(prop)
                                                    if (value && value.toLowerCase().includes('oklch')) {
                                                        rule.style.removeProperty(prop)
                                                    }
                                                }
                                            }
                                        }
                                    })
                                } catch (e) {
                                    // Ignore errors
                                }
                            })
                        } catch (e) {
                            // Ignore errors
                        }
                    }
                    
                    // Convert all oklch/modern CSS colors to standard formats (rgb/hex)
                    // The browser automatically converts oklch to rgb in computed styles
                    // We need to set these as inline styles so html2canvas can read them
                    const allElements = clonedDoc.querySelectorAll('*')
                    
                    allElements.forEach((el) => {
                        const element = el as HTMLElement
                        try {
                            // Get computed styles from the cloned document's window
                            // Browser will have already converted oklch to rgb
                            const computedStyle = win.getComputedStyle(element)
                            
                            // Convert all color-related properties to inline styles
                            // This ensures html2canvas only sees rgb/hex values
                            const colorProps = [
                                'color',
                                'backgroundColor',
                                'borderColor',
                                'borderTopColor',
                                'borderRightColor',
                                'borderBottomColor',
                                'borderLeftColor',
                                'outlineColor',
                                'textDecorationColor',
                                'columnRuleColor',
                                'fill', // SVG fill
                                'stroke' // SVG stroke
                            ]
                            
                            colorProps.forEach(prop => {
                                try {
                                    // Get the computed value
                                    let value = computedStyle.getPropertyValue(prop)
                                    if (!value) {
                                        value = (computedStyle as any)[prop]
                                    }
                                    
                                    // Only set if it's a valid color value and doesn't contain unsupported functions
                                    if (value && 
                                        value.trim() !== '' &&
                                        value !== 'transparent' && 
                                        value !== 'rgba(0, 0, 0, 0)' &&
                                        value !== 'none' &&
                                        !value.toLowerCase().includes('oklch') &&
                                        !value.toLowerCase().includes('lab(') &&
                                        !value.toLowerCase().includes('lch(') &&
                                        !value.toLowerCase().includes('color(')) {
                                        // Set as inline style with important to override any CSS rules
                                        element.style.setProperty(prop, value, 'important')
                                    } else if (value && value.toLowerCase().includes('oklch')) {
                                        // If we find oklch, set a fallback color
                                        if (prop === 'backgroundColor') {
                                            element.style.setProperty(prop, '#ffffff', 'important')
                                        } else if (prop === 'color') {
                                            element.style.setProperty(prop, '#000000', 'important')
                                        } else {
                                            element.style.setProperty(prop, 'transparent', 'important')
                                        }
                                    }
                                } catch (e) {
                                    // Skip this property if there's an error
                                }
                            })
                            
                            // Also check background-image for gradients that might use oklch
                            const bgImage = computedStyle.getPropertyValue('background-image')
                            if (bgImage && bgImage.toLowerCase().includes('oklch')) {
                                // Remove background-image if it contains oklch
                                element.style.setProperty('background-image', 'none', 'important')
                            }
                        } catch (e) {
                            // Silently continue if there's an error
                            console.debug('Error processing element styles:', e)
                        }
                    })
                }
            }

            const canvas = await html2canvas(chartContainerRef.current, options)
            
            // Restore original styles after rendering
            styleBackups.forEach((originalStyle, element) => {
                if (originalStyle) {
                    element.setAttribute('style', originalStyle)
                } else {
                    element.removeAttribute('style')
                }
            })
            
            return canvas
        } catch (error) {
            console.error('Canvas rendering error:', error)
            
            // Restore original styles even on error
            styleBackups.forEach((originalStyle, element) => {
                if (originalStyle) {
                    element.setAttribute('style', originalStyle)
                } else {
                    element.removeAttribute('style')
                }
            })
            
            throw error
        }
    }

    // Download as PNG
    const handleDownloadPNG = async () => {
        try {
            if (!chartContainerRef.current) {
                alert('Chart not found. Please add some members first.')
                return
            }

            // Show loading indicator
            const loadingMsg = document.createElement('div')
            loadingMsg.id = 'png-loading-msg'
            loadingMsg.textContent = 'Generating high-quality PNG...'
            loadingMsg.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#000;color:#fff;padding:20px;border-radius:8px;z-index:10000;font-family:Arial,sans-serif;'
            document.body.appendChild(loadingMsg)

            try {
                const canvas = await renderChartToCanvas(300, true)

                const msg = document.getElementById('png-loading-msg')
                if (msg) document.body.removeChild(msg)

                // Convert to blob with high quality
                canvas.toBlob((blob) => {
                    if (!blob) {
                        alert('Failed to create image. Please try again.')
                        return
                    }
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `organization-chart-${paperSize}-${orientation}.png`
                    a.click()
                    URL.revokeObjectURL(url)
                }, 'image/png', 1.0)
            } catch (renderError) {
                const msg = document.getElementById('png-loading-msg')
                if (msg) document.body.removeChild(msg)
                throw renderError
            }
        } catch (error) {
            console.error('Download PNG error:', error)
            const msg = document.getElementById('png-loading-msg')
            if (msg) document.body.removeChild(msg)
            alert('Failed to download PNG. Please try again.')
        }
    }

    // Print chart
    const handlePrint = async () => {
        try {
            if (!chartContainerRef.current) {
                alert('Chart not found. Please add some members first.')
                return
            }

            // Show loading indicator
            const loadingMsg = document.createElement('div')
            loadingMsg.id = 'print-loading-msg'
            loadingMsg.textContent = 'Preparing high-quality print...'
            loadingMsg.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#000;color:#fff;padding:20px;border-radius:8px;z-index:10000;font-family:Arial,sans-serif;'
            document.body.appendChild(loadingMsg)

            // Create a new window for printing
            const printWindow = window.open('', '_blank')
            if (!printWindow) {
                const msg = document.getElementById('print-loading-msg')
                if (msg) document.body.removeChild(msg)
                alert('Please allow popups to print.')
                return
            }

            const dimensions = getPaperDimensionsMm()
            const dpi = 300 // High resolution for print

            // Render chart to image at high resolution
            const canvas = await renderChartToCanvas(dpi, true)

            // Get high-quality image data
            const imgData = canvas.toDataURL('image/png', 1.0)

            const msg = document.getElementById('print-loading-msg')
            if (msg) document.body.removeChild(msg)

            // Create print HTML with high-resolution image
            printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print Organization Chart</title>
            <style>
              @page {
                size: ${dimensions.width}mm ${dimensions.height}mm;
                margin: 0;
              }
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              body {
                margin: 0;
                padding: 0;
                width: ${dimensions.width}mm;
                height: ${dimensions.height}mm;
                overflow: hidden;
              }
              img {
                width: 100%;
                height: 100%;
                object-fit: contain;
                display: block;
                image-rendering: -webkit-optimize-contrast;
                image-rendering: crisp-edges;
              }
            </style>
          </head>
          <body>
            <img src="${imgData}" alt="Organization Chart" style="width: ${dimensions.width}mm; height: ${dimensions.height}mm;" />
            <script>
              window.onload = function() {
                // Small delay to ensure image is loaded
                setTimeout(function() {
                  window.print();
                  window.onafterprint = function() {
                    window.close();
                  };
                }, 250);
              };
            </script>
          </body>
        </html>
      `)
            printWindow.document.close()
        } catch (error) {
            console.error('Print error:', error)
            const msg = document.getElementById('print-loading-msg')
            if (msg) document.body.removeChild(msg)
            alert('Print failed. Please try again.')
        }
    }

    // Download as PDF
    const handleDownloadPDF = async () => {
        try {
            if (!chartContainerRef.current) {
                alert('Chart not found. Please add some members first.')
                return
            }

            // Show loading indicator
            const loadingMsg = document.createElement('div')
            loadingMsg.id = 'pdf-loading-msg'
            loadingMsg.textContent = 'Generating high-quality PDF...'
            loadingMsg.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#000;color:#fff;padding:20px;border-radius:8px;z-index:10000;font-family:Arial,sans-serif;'
            document.body.appendChild(loadingMsg)

            const dimensions = getPaperDimensionsMm()
            const dpi = 300

            // Render chart to image at high resolution
            const canvas = await renderChartToCanvas(dpi, true)

            // Create PDF
            const pdf = new jsPDF({
                orientation: orientation === 'landscape' ? 'landscape' : 'portrait',
                unit: 'mm',
                format: paperSize === 'Legal' ? [dimensions.width, dimensions.height] : paperSize.toLowerCase(),
                compress: true
            })

            // Convert canvas to image data with high quality
            const imgData = canvas.toDataURL('image/png', 1.0)

            // Calculate dimensions to fit PDF page
            const pdfWidth = pdf.internal.pageSize.getWidth()
            const pdfHeight = pdf.internal.pageSize.getHeight()

            // Add image to PDF with proper dimensions
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'SLOW')

            const msg = document.getElementById('pdf-loading-msg')
            if (msg) document.body.removeChild(msg)

            // Download PDF
            pdf.save(`organization-chart-${paperSize}-${orientation}.pdf`)
        } catch (error) {
            console.error('PDF export error:', error)
            const msg = document.getElementById('pdf-loading-msg')
            if (msg) document.body.removeChild(msg)
            alert('PDF export failed. Please try again.')
        }
    }

    // Get style classes based on selected style
    const getStyleClasses = () => {
        const styles: Record<string, {
            card: string;
            border: string;
            text: string;
            role: string;
            avatar: string;
            avatarIcon?: string;
            headerBg?: string;
            lineColor?: string;
            avatarBorderGradient?: string;
        }> = {
            modern: {
                card: 'bg-transparent border border-gray-300 rounded-lg shadow-md',
                border: 'border-gray-300',
                text: 'text-gray-900',
                role: 'text-white',
                avatar: 'bg-white border-2 border-white',
                avatarIcon: 'text-gray-600',
                headerBg: '#1e40af', // Dark blue for top section
                lineColor: '#3b82f6'
            },
            classic: {
                card: 'bg-blue-600 border-2 rounded-lg shadow-md',
                border: 'border-blue-700',
                text: 'text-white',
                role: 'text-white',
                avatar: 'bg-gradient-to-br from-gray-400 to-gray-600 border-2 border-white',
                lineColor: '#3b82f6' // Blue lines for classic style
            },
            minimal: {
                card: 'bg-white border rounded shadow-sm',
                border: 'border-gray-300',
                text: 'text-gray-900',
                role: 'text-gray-600',
                avatar: 'bg-gray-200 border border-gray-400',
                lineColor: '#3b82f6' // Blue lines for minimal style
            },
            colorful: {
                card: 'bg-gradient-to-br from-purple-50 to-pink-50 border-2 rounded-2xl shadow-xl',
                border: 'border-purple-500',
                text: 'text-gray-900',
                role: 'text-purple-600',
                avatar: 'bg-gradient-to-br from-purple-400 to-pink-500 border-2 border-purple-500',
                lineColor: '#ec4899' // Vibrant pink for colorful style
            },
            professional: {
                card: 'bg-gray-800 border border-gray-700 rounded-lg shadow-md',
                border: 'border-gray-700',
                text: 'text-white',
                role: 'text-white',
                avatar: 'bg-gray-700 border-2 border-white',
                lineColor: '#9ca3af', // Light gray for professional style
                headerBg: '#64646F'
            },
            twolevel: {
                card: 'bg-white border border-gray-300 rounded-lg shadow-sm',
                border: 'border-gray-300',
                text: 'text-gray-900',
                role: 'text-gray-600',
                avatar: 'bg-gray-100 border border-gray-300',
                lineColor: '#d1d5db', // Light gray lines for 2-level style
                avatarIcon: 'text-gray-500'
            },
            threelevel: {
                card: 'bg-white border border-gray-300 rounded-lg shadow-sm',
                border: 'border-gray-300',
                text: 'text-gray-900',
                role: 'text-gray-600',
                avatar: 'bg-gray-100 border border-gray-300',
                lineColor: '#d1d5db', // Light gray lines for 3-level style
                avatarIcon: 'text-gray-500'
            },
            fourlevel: {
                card: 'bg-white border border-gray-300 rounded-lg shadow-sm',
                border: 'border-gray-300',
                text: 'text-gray-900',
                role: 'text-gray-600',
                avatar: 'bg-gray-100 border border-gray-300',
                lineColor: '#d1d5db', // Light gray lines for 4-level style
                avatarIcon: 'text-gray-500'
            },
            colorcoded: {
                card: 'bg-white border-2 rounded-lg shadow-md',
                border: 'border-gray-300',
                text: 'text-white',
                role: 'text-white',
                avatar: 'bg-white border-2 border-white',
                lineColor: '#6b7280', // Gray lines for colorcoded style
                avatarIcon: 'text-gray-600'
            },
            // NEW ENGINEERING DIAGRAM STYLES
            wiring: {
                card: 'bg-white border-3 border-gray-600 rounded-md shadow-lg',
                border: 'border-gray-600',
                text: 'text-gray-900',
                role: 'text-gray-700 font-bold',
                avatar: 'bg-gray-100 border-2 border-gray-400',
                lineColor: '#dc2626', // Red for wiring (power lines)
                avatarIcon: 'text-gray-600'
            },
            pid: {
                card: 'bg-gradient-to-b from-slate-700 to-slate-800 border-3 border-slate-500 rounded-xl shadow-2xl',
                border: 'border-slate-500',
                text: 'text-white',
                role: 'text-cyan-300 font-semibold uppercase',
                avatar: 'bg-white border-2 border-cyan-400',
                lineColor: '#64748b', // Slate for P&ID flow lines
                avatarIcon: 'text-slate-700'
            },
            circuit: {
                card: 'bg-gray-100 border-3 border-gray-700 rounded-sm shadow-lg',
                border: 'border-gray-700',
                text: 'text-gray-900 font-semibold',
                role: 'text-gray-700 font-bold uppercase',
                avatar: 'bg-gray-300 border-2 border-gray-600',
                lineColor: '#374151', // Dark gray for circuit traces
                avatarIcon: 'text-gray-700'
            },
            mechanical: {
                card: 'bg-gradient-to-br from-indigo-50 to-white border-2 border-indigo-500 rounded-lg shadow-xl',
                border: 'border-indigo-500',
                text: 'text-gray-900',
                role: 'text-indigo-700 font-bold uppercase',
                avatar: 'bg-indigo-100 border-2 border-indigo-400',
                lineColor: '#6366f1', // Indigo for mechanical diagrams
                avatarIcon: 'text-indigo-600'
            },
            // NEW ORGANIZATION CHART STYLES
            photo: {
                card: 'bg-white border-2 border-amber-400 rounded-2xl shadow-lg',
                border: 'border-amber-400',
                text: 'text-gray-900 font-semibold',
                role: 'text-amber-600 font-medium',
                avatar: 'bg-gradient-to-br from-amber-100 to-amber-200 border-3 border-amber-300',
                lineColor: '#f59e0b', // Amber for photo chart
                avatarIcon: 'text-amber-600'
            },
            horizontal: {
                card: 'bg-gradient-to-r from-rose-500 to-pink-500 border-2 border-rose-600 rounded-xl shadow-xl',
                border: 'border-rose-600',
                text: 'text-white font-bold',
                role: 'text-rose-100 font-semibold',
                avatar: 'bg-white border-3 border-white',
                lineColor: '#f43f5e', // Rose for horizontal chart
                avatarIcon: 'text-rose-500'
            },
            company: {
                card: 'bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-slate-600 rounded-lg shadow-2xl',
                border: 'border-slate-600',
                text: 'text-white font-bold',
                role: 'text-amber-400 font-semibold uppercase',
                avatar: 'bg-amber-400 border-3 border-amber-300',
                lineColor: '#64748b', // Slate for company chart
                avatarIcon: 'text-slate-800'
            },
            nonprofit: {
                card: 'bg-gradient-to-b from-emerald-600 to-emerald-700 border-3 border-emerald-500 rounded-xl shadow-xl',
                border: 'border-emerald-500',
                text: 'text-white font-bold',
                role: 'text-emerald-100 font-semibold',
                avatar: 'bg-white border-3 border-emerald-300',
                lineColor: '#10b981', // Emerald for nonprofit chart
                avatarIcon: 'text-emerald-600'
            },
            corporate: {
                card: 'bg-gradient-to-b from-zinc-900 to-black border-2 border-amber-500 rounded-lg shadow-2xl',
                border: 'border-amber-500',
                text: 'text-white font-bold',
                role: 'text-amber-400 font-bold uppercase',
                avatar: 'bg-amber-500 border-4 border-amber-400',
                lineColor: '#71717a', // Zinc for corporate chart
                avatarIcon: 'text-zinc-900'
            },
            hospital: {
                card: 'bg-gradient-to-b from-blue-700 to-blue-800 border-3 border-blue-500 rounded-xl shadow-2xl',
                border: 'border-blue-500',
                text: 'text-white font-bold',
                role: 'text-blue-100 font-bold uppercase',
                avatar: 'bg-white border-4 border-blue-300',
                lineColor: '#3b82f6', // Blue for hospital chart
                avatarIcon: 'text-blue-700'
            },
            hr: {
                card: 'bg-gradient-to-b from-orange-500 to-orange-600 border-3 border-orange-400 rounded-xl shadow-xl',
                border: 'border-orange-400',
                text: 'text-white font-bold',
                role: 'text-orange-100 font-semibold',
                avatar: 'bg-white border-3 border-orange-200',
                lineColor: '#f97316', // Orange for HR chart
                avatarIcon: 'text-orange-600'
            },
            school: {
                card: 'bg-gradient-to-b from-indigo-700 to-indigo-800 border-3 border-indigo-500 rounded-xl shadow-2xl',
                border: 'border-indigo-500',
                text: 'text-white font-bold',
                role: 'text-indigo-100 font-bold uppercase',
                avatar: 'bg-amber-400 border-4 border-amber-300',
                lineColor: '#6366f1', // Indigo for school chart
                avatarIcon: 'text-indigo-800'
            }
        }
        return styles[chartStyle] || styles.modern
    }

    const updateMember = (id, field, value) => {
        setOrgMembers(prev => prev.map(member =>
            member.id === id ? { ...member, [field]: value } : member
        ))
    }

    const removeMember = (id) => {
        setOrgMembers(prev => {
            // Remove the member and also remove any parent references
            return prev.filter(member => member.id !== id).map(member =>
                member.parentId === id ? { ...member, parentId: null } : member
            )
        })
        setMemberPositions(prev => {
            const newPos = { ...prev }
            delete newPos[id]
            return newPos
        })
    }

    // Drag and Drop Handlers
    const handleDragStart = (e, memberId) => {
        // Prevent HTML5 drag if we're doing position dragging
        if (isPositionDraggingRef.current) {
            e.preventDefault()
            e.stopPropagation()
            return false
        }
        // Only proceed with HTML5 drag if Alt/Option key is pressed (for linking)
        // This allows linking while keeping position dragging as default
        if (!e.altKey && !e.metaKey) {
            // Cancel the drag - user wants to move position, not link
            e.preventDefault()
            e.stopPropagation()
            return false
        }
        setDraggedMember(memberId)
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/html', memberId)
    }

    const handleDragOver = (e, memberId) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        if (memberId !== draggedMember) {
            setDragOverMember(memberId)
        }
    }

    const handleDragLeave = () => {
        setDragOverMember(null)
    }

    const handleDrop = (e, targetMemberId) => {
        e.preventDefault()
        if (draggedMember && targetMemberId && draggedMember !== targetMemberId) {
            // Set the dragged member's parent to the target member
            updateMember(draggedMember, 'parentId', targetMemberId)

            // Auto-position: place child below parent
            const targetPos = memberPositions[targetMemberId]
            if (targetPos) {
                setMemberPositions(prev => ({
                    ...prev,
                    [draggedMember]: {
                        x: targetPos.x,
                        y: targetPos.y + 150
                    }
                }))
            }
        }
        setDraggedMember(null)
        setDragOverMember(null)
    }

    const [isDraggingPosition, setIsDraggingPosition] = useState(false)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

    const handleMemberMouseDown = (e, memberId) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON' || e.target.closest('label')) {
            return // Don't drag if clicking on input/button
        }

        // If Alt/Option key is pressed, allow HTML5 drag for linking
        // Otherwise, do position dragging
        if (e.altKey || e.metaKey) {
            isPositionDraggingRef.current = false
            return // Allow HTML5 drag to proceed
        }

        // Prevent HTML5 drag when doing position drag
        e.preventDefault()
        e.stopPropagation()

        const position = memberPositions[memberId] || { x: 100, y: 100 }
        const rect = e.currentTarget.getBoundingClientRect()
        const offsetX = e.clientX - rect.left
        const offsetY = e.clientY - rect.top

        isPositionDraggingRef.current = true
        setDraggedMember(memberId)
        setIsDraggingPosition(true)
        setDragOffset({ x: offsetX, y: offsetY })
    }

    const handleMouseMove = useCallback((e) => {
        if (!isDraggingPosition || !draggedMember || !chartContainerRef.current) return

        const container = chartContainerRef.current
        const rect = container.getBoundingClientRect()
        const x = e.clientX - rect.left - dragOffset.x
        const y = e.clientY - rect.top - dragOffset.y

        setMemberPositions(prev => ({
            ...prev,
            [draggedMember]: {
                x: Math.max(0, Math.min(x, rect.width - 220)), // Updated for new card width (max 220px)
                y: Math.max(0, Math.min(y, rect.height - 180)) // Updated for new card height (~180px)
            }
        }))
    }, [isDraggingPosition, draggedMember, dragOffset])

    const handleMouseUp = useCallback(() => {
        isPositionDraggingRef.current = false
        setIsDraggingPosition(false)
        setDraggedMember(null)
        setDragOverMember(null)
    }, [])

    useEffect(() => {
        if (isDraggingPosition) {
            window.addEventListener('mousemove', handleMouseMove)
            window.addEventListener('mouseup', handleMouseUp)
            return () => {
                window.removeEventListener('mousemove', handleMouseMove)
                window.removeEventListener('mouseup', handleMouseUp)
            }
        }
    }, [isDraggingPosition, handleMouseMove, handleMouseUp])

    // Get children of a member
    const getChildren = (memberId) => {
        return orgMembers.filter(m => m.parentId === memberId)
    }

    // Get parent of a member
    const getParent = (memberId) => {
        const member = orgMembers.find(m => m.id === memberId)
        if (member && member.parentId) {
            return orgMembers.find(m => m.id === member.parentId)
        }
        return null
    }

    // Get hierarchy level of a member (0 = top level, 1 = second level, 2 = third level, etc.)
    const getHierarchyLevel = (memberId) => {
        let level = 0
        let currentMember = orgMembers.find(m => m.id === memberId)

        while (currentMember && currentMember.parentId) {
            level++
            currentMember = orgMembers.find(m => m.id === currentMember.parentId)
        }

        return level
    }

    // Draw connection line between parent and child
    const drawConnection = (parentId, childId) => {
        const parent = memberPositions[parentId]
        const child = memberPositions[childId]
        if (!parent || !child) return null

        const styleClasses = getStyleClasses()
        let lineColor = styleClasses.lineColor

        // Card dimensions vary by style
        const cardWidth = 200 // Average of min 180px and max 220px
        // Modern style has shorter height due to horizontal layout, others are vertical
        const cardHeight = chartStyle === 'modern' ? 100 : 160 // Modern: ~100px, Others: ~160px
        const parentX = parent.x + (cardWidth / 2) // Center of card horizontally
        const parentY = parent.y + cardHeight // Bottom of card
        const childX = child.x + (cardWidth / 2) // Center of card horizontally
        const childY = child.y // Top of card

        const startX = parentX
        const startY = parentY
        const endX = childX
        const endY = childY
        const midY = startY + (endY - startY) / 2

        // Calculate bounding box for SVG
        const minX = Math.min(startX, endX) - 20
        const maxX = Math.max(startX, endX) + 20
        const minY = Math.min(startY, endY) - 20
        const maxY = Math.max(startY, endY) + 20

        // Get hierarchy level for color-coded connections
        const parentLevel = getHierarchyLevel(parentId)

        // Custom line styles for new diagram types
        let strokeWidth = 2
        let strokeDasharray = ''
        let strokeLinecap = 'round'
        let pathStyle = 'elbow' // elbow, straight, curved

        // WIRING DIAGRAM - Thick colored wires with terminal connectors
        if (chartStyle === 'wiring') {
            strokeWidth = 4
            strokeLinecap = 'round'
            pathStyle = 'elbow'
            if (parentLevel === 0) lineColor = '#dc2626' // Red
            else if (parentLevel === 1) lineColor = '#2563eb' // Blue
            else lineColor = '#16a34a' // Green
        }

        // P&ID - Flow lines with direction indicators
        if (chartStyle === 'pid') {
            strokeWidth = 3
            pathStyle = 'elbow'
            if (parentLevel === 0) lineColor = '#64748b' // Slate
            else if (parentLevel === 1) lineColor = '#0891b2' // Cyan
            else lineColor = '#14b8a6' // Teal
        }

        // CIRCUIT DIAGRAM - Precise angular connections
        if (chartStyle === 'circuit') {
            strokeWidth = 2
            strokeLinecap = 'square'
            pathStyle = 'elbow'
            lineColor = '#374151' // Gray-700 for all circuit traces
        }

        // MECHANICAL DIAGRAM - Technical drawing lines
        if (chartStyle === 'mechanical') {
            strokeWidth = 2
            strokeDasharray = '6,3'
            pathStyle = 'elbow'
            if (parentLevel === 0) lineColor = '#6366f1' // Indigo
            else if (parentLevel === 1) lineColor = '#a855f7' // Purple
            else lineColor = '#8b5cf6' // Violet
        }

        // PHOTO ORG CHART - Warm gradient lines
        if (chartStyle === 'photo') {
            strokeWidth = 3
            pathStyle = 'elbow'
            if (parentLevel === 0) lineColor = '#f59e0b' // Amber
            else if (parentLevel === 1) lineColor = '#0ea5e9' // Sky
            else lineColor = '#10b981' // Emerald
        }

        // HORIZONTAL ORG CHART - Vibrant gradient lines
        if (chartStyle === 'horizontal' || chartStyle === 'school') {
            strokeWidth = 3
            pathStyle = 'elbow'
            if (parentLevel === 0) lineColor = '#f43f5e' // Rose
            else if (parentLevel === 1) lineColor = '#d946ef' // Fuchsia
            else lineColor = '#8b5cf6' // Violet
        }

        // COMPANY ORG CHART - Professional slate lines
        if (chartStyle === 'company') {
            strokeWidth = 2
            pathStyle = 'elbow'
            if (parentLevel === 0) lineColor = '#64748b' // Slate
            else lineColor = '#94a3b8' // Slate-400
        }

        // NON-PROFIT ORG CHART - Green ecosystem lines
        if (chartStyle === 'nonprofit') {
            strokeWidth = 3
            pathStyle = 'elbow'
            if (parentLevel === 0) lineColor = '#10b981' // Emerald
            else if (parentLevel === 1) lineColor = '#14b8a6' // Teal
            else lineColor = '#06b6d4' // Cyan
        }

        // CORPORATE ORG CHART - Formal dark lines
        if (chartStyle === 'corporate') {
            strokeWidth = 2
            pathStyle = 'elbow'
            if (parentLevel === 0) lineColor = '#f59e0b' // Amber accent
            else lineColor = '#71717a' // Zinc-500
        }

        // HOSPITAL ORG CHART - Medical blue lines
        if (chartStyle === 'hospital') {
            strokeWidth = 3
            pathStyle = 'elbow'
            if (parentLevel === 0) lineColor = '#3b82f6' // Blue
            else if (parentLevel === 1) lineColor = '#0ea5e9' // Sky
            else lineColor = '#14b8a6' // Teal
        }

        // HR CHART - Warm people-focused lines
        if (chartStyle === 'hr') {
            strokeWidth = 3
            pathStyle = 'elbow'
            if (parentLevel === 0) lineColor = '#f97316' // Orange
            else if (parentLevel === 1) lineColor = '#f59e0b' // Amber
            else lineColor = '#eab308' // Yellow
        }

        // Generate path based on style
        let pathD = ''
        if (pathStyle === 'elbow') {
            pathD = `M ${startX - minX} ${startY - minY} 
                     L ${startX - minX} ${midY - minY}
                     L ${endX - minX} ${midY - minY}
                     L ${endX - minX} ${endY - minY}`
        } else if (pathStyle === 'curved') {
            const controlY = startY + (endY - startY) * 0.5
            pathD = `M ${startX - minX} ${startY - minY} 
                     C ${startX - minX} ${controlY - minY},
                       ${endX - minX} ${controlY - minY},
                       ${endX - minX} ${endY - minY}`
        } else {
            pathD = `M ${startX - minX} ${startY - minY} L ${endX - minX} ${endY - minY}`
        }

        return (
            <svg
                key={`line-${parentId}-${childId}`}
                className="absolute pointer-events-none z-0"
                style={{
                    left: `${minX}px`,
                    top: `${minY}px`,
                    width: `${maxX - minX}px`,
                    height: `${maxY - minY}px`
                }}
            >
                {/* Shadow effect for wiring diagram */}
                {chartStyle === 'wiring' && (
                    <path
                        d={pathD}
                        stroke="rgba(0,0,0,0.2)"
                        strokeWidth={strokeWidth + 2}
                        fill="none"
                        strokeLinecap={strokeLinecap as any}
                        transform="translate(2, 2)"
                    />
                )}
                
                {/* Main connection line */}
                <path
                    d={pathD}
                    stroke={lineColor}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={strokeDasharray}
                    strokeLinecap={strokeLinecap as any}
                    markerEnd={`url(#arrowhead-${parentId}-${childId})`}
                />

                {/* Connection dots for wiring diagram */}
                {chartStyle === 'wiring' && (
                    <>
                        <circle 
                            cx={startX - minX} 
                            cy={startY - minY} 
                            r="6" 
                            fill={lineColor}
                            stroke="#fff"
                            strokeWidth="2"
                        />
                        <circle 
                            cx={endX - minX} 
                            cy={endY - minY} 
                            r="5" 
                            fill={lineColor}
                            stroke="#fff"
                            strokeWidth="2"
                        />
                    </>
                )}

                {/* Flow direction indicator for P&ID */}
                {chartStyle === 'pid' && (
                    <circle 
                        cx={(startX - minX + endX - minX) / 2} 
                        cy={midY - minY} 
                        r="4" 
                        fill={lineColor}
                    />
                )}

                {/* Junction dots for circuit diagram */}
                {chartStyle === 'circuit' && (
                    <>
                        <circle 
                            cx={startX - minX} 
                            cy={midY - minY} 
                            r="3" 
                            fill={lineColor}
                        />
                    </>
                )}

                <defs>
                    <marker
                        id={`arrowhead-${parentId}-${childId}`}
                        markerWidth={chartStyle === 'wiring' ? 12 : 10}
                        markerHeight={chartStyle === 'wiring' ? 12 : 10}
                        refX={chartStyle === 'wiring' ? 6 : 5}
                        refY={chartStyle === 'wiring' ? 4 : 3}
                        orient="auto"
                    >
                        <polygon 
                            points={chartStyle === 'wiring' ? "0 0, 12 4, 0 8" : "0 0, 10 3, 0 6"} 
                            fill={lineColor} 
                        />
                    </marker>
                </defs>
            </svg>
        )
    }

  // Draggable Member Card Component
  const DraggableMemberCard: React.FC<{ member: any }> = ({ member }) => {
        const styleClasses = getStyleClasses()
        const position = memberPositions[member.id] || { x: 100, y: 100 }
        const isDragging = draggedMember === member.id
        const isDragOver = dragOverMember === member.id
        const hierarchyLevel = getHierarchyLevel(member.id)

        // Get minimal style colors based on hierarchy level
        const getMinimalCardStyle = () => {
            if (hierarchyLevel === 0) {
                // Top level - Red
                return {
                    card: 'bg-red-600 border-2 rounded-lg shadow-sm',
                    border: 'border-red-700',
                    text: 'text-white',
                    role: 'text-white',
                    avatar: 'bg-white border-2 border-white',
                    avatarIcon: 'text-white'
                }
            } else if (hierarchyLevel === 1) {
                // Second level - Light Blue
                return {
                    card: 'bg-blue-500 border-2 rounded-lg shadow-sm',
                    border: 'border-blue-600',
                    text: 'text-white',
                    role: 'text-white',
                    avatar: 'bg-white border-2 border-white',
                    avatarIcon: 'text-white'
                }
            } else {
                // Third level and below - Yellow
                return {
                    card: 'bg-yellow-400 border-2 rounded-lg shadow-sm',
                    border: 'border-yellow-500',
                    text: 'text-gray-900',
                    role: 'text-gray-900',
                    avatar: 'bg-gray-900 border-2 border-gray-900',
                    avatarIcon: 'text-gray-900'
                }
            }
        }

        // Get classic style colors based on hierarchy level
        const getClassicCardStyle = () => {
            if (hierarchyLevel === 0) {
                // Top level - Dark Blue
                return {
                    card: 'bg-blue-800 border-2 rounded-lg shadow-md',
                    border: 'border-blue-900',
                    text: 'text-white',
                    role: 'text-white',
                    avatar: 'bg-white border-2 border-white',
                    avatarIcon: 'text-gray-600'
                }
            } else if (hierarchyLevel === 1) {
                // Second level - Orange
                return {
                    card: 'bg-orange-500 border-2 rounded-lg shadow-md',
                    border: 'border-orange-600',
                    text: 'text-white',
                    role: 'text-white',
                    avatar: 'bg-white border-2 border-white',
                    avatarIcon: 'text-gray-600'
                }
            } else if (hierarchyLevel === 2 || hierarchyLevel === 3) {
                // Third and Fourth level - Blue
                return {
                    card: 'bg-blue-500 border-2 rounded-lg shadow-md',
                    border: 'border-blue-600',
                    text: 'text-white',
                    role: 'text-white',
                    avatar: 'bg-white border-2 border-white',
                    avatarIcon: 'text-gray-600'
                }
            } else {
                // Fifth level and below - Green
                return {
                    card: 'bg-green-500 border-2 rounded-lg shadow-md',
                    border: 'border-green-600',
                    text: 'text-white',
                    role: 'text-white',
                    avatar: 'bg-white border-2 border-white',
                    avatarIcon: 'text-gray-600'
                }
            }
        }

        // Get colorful style colors based on hierarchy level
        const getColorfulCardStyle = () => {
            if (hierarchyLevel === 0) {
                // Top level - Vibrant Red Gradient
                return {
                    card: 'bg-transparent border-2 border-red-500 rounded-2xl shadow-none',
                    border: 'border-red-500',
                    text: 'text-gray-900',
                    role: 'text-gray-900',
                    avatar: 'bg-white',
                    avatarIcon: 'text-gray-600',
                    avatarBorderGradient: 'from-red-500 via-red-600 to-pink-600'
                }
            } else if (hierarchyLevel === 1) {
                // Second level - Vibrant Blue/Purple Gradient
                return {
                    card: 'bg-transparent border-2 border-purple-500 rounded-2xl shadow-none',
                    border: 'border-purple-500',
                    text: 'text-gray-900',
                    role: 'text-gray-900',
                    avatar: 'bg-white',
                    avatarIcon: 'text-gray-600',
                    avatarBorderGradient: 'from-blue-500 via-purple-500 to-pink-500'
                }
            } else {
                // Third level and below - Vibrant Yellow/Orange Gradient
                return {
                    card: 'bg-transparent border-2 border-orange-400 rounded-2xl shadow-none',
                    border: 'border-orange-400',
                    text: 'text-gray-900',
                    role: 'text-gray-900',
                    avatar: 'bg-white',
                    avatarIcon: 'text-gray-600',
                    avatarBorderGradient: 'from-yellow-400 via-orange-400 to-pink-400'
                }
            }
        }

        // Get professional style colors - uniform dark gray for all levels
        const getProfessionalCardStyle = (): {
            card: string;
            border: string;
            text: string;
            role: string;
            avatar: string;
            avatarIcon: string;
            headerBg: string;
            avatarBorderGradient?: string;
        } => {
            return {
                card: 'bg-black border border-gray-600 rounded-lg shadow-md',
                border: 'border-gray-600',
                text: 'text-white',
                role: 'text-white',
                avatar: 'bg-gray-700 border-2 border-white',
                avatarIcon: 'text-white',
                headerBg: '#64646F' // Background color for name and role section
            }
        }

        // Get 2-level style colors - minimalistic with light gray outlines
        const getTwoLevelCardStyle = () => {
            if (hierarchyLevel === 0) {
                // Top level - parent node
                return {
                    card: 'bg-white border border-gray-300 rounded-lg shadow-sm',
                    border: 'border-gray-300',
                    text: 'text-gray-900',
                    role: 'text-gray-600',
                    avatar: 'bg-gray-100 border border-gray-300',
                    avatarIcon: 'text-gray-500'
                }
            } else {
                // Second level and below - children nodes
                return {
                    card: 'bg-white border border-gray-300 rounded-lg shadow-sm',
                    border: 'border-gray-300',
                    text: 'text-gray-900',
                    role: 'text-gray-600',
                    avatar: 'bg-gray-100 border border-gray-300',
                    avatarIcon: 'text-gray-500'
                }
            }
        }

        // Get 3-level style colors - minimalistic with light gray outlines
        const getThreeLevelCardStyle = () => {
            if (hierarchyLevel === 0) {
                // Top level - parent node
                return {
                    card: 'bg-white border border-gray-300 rounded-lg shadow-sm',
                    border: 'border-gray-300',
                    text: 'text-gray-900',
                    role: 'text-gray-600',
                    avatar: 'bg-gray-100 border border-gray-300',
                    avatarIcon: 'text-gray-500'
                }
            } else if (hierarchyLevel === 1) {
                // Second level - middle nodes
                return {
                    card: 'bg-white border border-gray-300 rounded-lg shadow-sm',
                    border: 'border-gray-300',
                    text: 'text-gray-900',
                    role: 'text-gray-600',
                    avatar: 'bg-gray-100 border border-gray-300',
                    avatarIcon: 'text-gray-500'
                }
            } else {
                // Third level and below - children nodes
                return {
                    card: 'bg-white border border-gray-300 rounded-lg shadow-sm',
                    border: 'border-gray-300',
                    text: 'text-gray-900',
                    role: 'text-gray-600',
                    avatar: 'bg-gray-100 border border-gray-300',
                    avatarIcon: 'text-gray-500'
                }
            }
        }

        // Get 4-level style colors - minimalistic with light gray outlines
        const getFourLevelCardStyle = () => {
            if (hierarchyLevel === 0) {
                // Top level - parent node
                return {
                    card: 'bg-white border border-gray-300 rounded-lg shadow-sm',
                    border: 'border-gray-300',
                    text: 'text-gray-900',
                    role: 'text-gray-600',
                    avatar: 'bg-gray-100 border border-gray-300',
                    avatarIcon: 'text-gray-500'
                }
            } else if (hierarchyLevel === 1) {
                // Second level - middle nodes
                return {
                    card: 'bg-white border border-gray-300 rounded-lg shadow-sm',
                    border: 'border-gray-300',
                    text: 'text-gray-900',
                    role: 'text-gray-600',
                    avatar: 'bg-gray-100 border border-gray-300',
                    avatarIcon: 'text-gray-500'
                }
            } else if (hierarchyLevel === 2) {
                // Third level - middle nodes
                return {
                    card: 'bg-white border border-gray-300 rounded-lg shadow-sm',
                    border: 'border-gray-300',
                    text: 'text-gray-900',
                    role: 'text-gray-600',
                    avatar: 'bg-gray-100 border border-gray-300',
                    avatarIcon: 'text-gray-500'
                }
            } else {
                // Fourth level and below - children nodes
                return {
                    card: 'bg-white border border-gray-300 rounded-lg shadow-sm',
                    border: 'border-gray-300',
                    text: 'text-gray-900',
                    role: 'text-gray-600',
                    avatar: 'bg-gray-100 border border-gray-300',
                    avatarIcon: 'text-gray-500'
                }
            }
        }

        // Get color-coded style colors - Blue for levels 0,2; Green for levels 1,3; Orange for level 4+
        const getColorCodedCardStyle = () => {
            if (hierarchyLevel === 0 || hierarchyLevel === 2) {
                // Top level and third level - Blue (Board of Directors, Executive Assistant)
                return {
                    card: 'bg-blue-600 border-2 border-blue-700 rounded-lg shadow-md',
                    border: 'border-blue-700',
                    text: 'text-white',
                    role: 'text-white',
                    avatar: 'bg-white border-2 border-white',
                    avatarIcon: 'text-blue-600'
                }
            } else if (hierarchyLevel === 1 || hierarchyLevel === 3) {
                // Second and fourth level - Green (Executive Director, Directors)
                return {
                    card: 'bg-green-600 border-2 border-green-700 rounded-lg shadow-md',
                    border: 'border-green-700',
                    text: 'text-white',
                    role: 'text-white',
                    avatar: 'bg-white border-2 border-white',
                    avatarIcon: 'text-green-600'
                }
            } else {
                // Fifth level and below - Orange (Subordinates)
                return {
                    card: 'bg-orange-500 border-2 border-orange-600 rounded-lg shadow-md',
                    border: 'border-orange-600',
                    text: 'text-white',
                    role: 'text-white',
                    avatar: 'bg-white border-2 border-white',
                    avatarIcon: 'text-orange-600'
                }
            }
        }

        // WIRING DIAGRAM STYLE - Clear connections with elbow lines, component-like boxes
        const getWiringCardStyle = () => {
            if (hierarchyLevel === 0) {
                // Power Source / CEO - Red terminal
                return {
                    card: 'bg-white border-3 border-red-600 rounded-md shadow-lg',
                    border: 'border-red-600',
                    text: 'text-gray-900',
                    role: 'text-red-700 font-bold',
                    avatar: 'bg-red-100 border-2 border-red-400',
                    avatarIcon: 'text-red-600',
                    isWiring: true,
                    wireColor: '#dc2626'
                }
            } else if (hierarchyLevel === 1) {
                // Control Points - Blue terminals (Managers)
                return {
                    card: 'bg-white border-3 border-blue-600 rounded-md shadow-lg',
                    border: 'border-blue-600',
                    text: 'text-gray-900',
                    role: 'text-blue-700 font-bold',
                    avatar: 'bg-blue-100 border-2 border-blue-400',
                    avatarIcon: 'text-blue-600',
                    isWiring: true,
                    wireColor: '#2563eb'
                }
            } else {
                // End Points - Green terminals (Employees)
                return {
                    card: 'bg-white border-3 border-green-600 rounded-md shadow-lg',
                    border: 'border-green-600',
                    text: 'text-gray-900',
                    role: 'text-green-700 font-bold',
                    avatar: 'bg-green-100 border-2 border-green-400',
                    avatarIcon: 'text-green-600',
                    isWiring: true,
                    wireColor: '#16a34a'
                }
            }
        }

        // P&ID STYLE - Department containers with flow direction, process-like appearance
        const getPidCardStyle = () => {
            if (hierarchyLevel === 0) {
                // Main System - Large container with thick border
                return {
                    card: 'bg-gradient-to-b from-slate-700 to-slate-800 border-4 border-slate-500 rounded-xl shadow-2xl',
                    border: 'border-slate-500',
                    text: 'text-white',
                    role: 'text-cyan-300 font-semibold uppercase tracking-wider',
                    avatar: 'bg-white border-2 border-cyan-400',
                    avatarIcon: 'text-slate-700',
                    isPid: true,
                    flowIndicator: 'top'
                }
            } else if (hierarchyLevel === 1) {
                // Control Valves / Managers - Medium containers
                return {
                    card: 'bg-gradient-to-b from-cyan-600 to-cyan-700 border-3 border-cyan-400 rounded-lg shadow-xl',
                    border: 'border-cyan-400',
                    text: 'text-white',
                    role: 'text-cyan-100 font-semibold uppercase tracking-wide',
                    avatar: 'bg-white border-2 border-cyan-300',
                    avatarIcon: 'text-cyan-700',
                    isPid: true,
                    flowIndicator: 'middle'
                }
            } else {
                // Flow Endpoints - Smaller elements
                return {
                    card: 'bg-gradient-to-b from-teal-500 to-teal-600 border-2 border-teal-300 rounded-lg shadow-lg',
                    border: 'border-teal-300',
                    text: 'text-white',
                    role: 'text-teal-100 font-medium',
                    avatar: 'bg-white border-2 border-teal-200',
                    avatarIcon: 'text-teal-600',
                    isPid: true,
                    flowIndicator: 'bottom'
                }
            }
        }

        // CIRCUIT DIAGRAM STYLE - Logic paths, power flow, hierarchical
        const getCircuitCardStyle = () => {
            if (hierarchyLevel === 0) {
                // Power Source - Main supply (Top Management)
                return {
                    card: 'bg-yellow-400 border-4 border-yellow-600 rounded-none shadow-xl',
                    border: 'border-yellow-600',
                    text: 'text-gray-900 font-bold',
                    role: 'text-yellow-800 font-black uppercase',
                    avatar: 'bg-yellow-200 border-3 border-yellow-500',
                    avatarIcon: 'text-yellow-700',
                    isCircuit: true,
                    symbolType: 'power'
                }
            } else if (hierarchyLevel === 1) {
                // Control Logic - Switches/Controllers (Mid Management)
                return {
                    card: 'bg-gray-100 border-3 border-gray-700 rounded-sm shadow-lg',
                    border: 'border-gray-700',
                    text: 'text-gray-900 font-semibold',
                    role: 'text-gray-700 font-bold uppercase',
                    avatar: 'bg-gray-300 border-2 border-gray-600',
                    avatarIcon: 'text-gray-700',
                    isCircuit: true,
                    symbolType: 'switch'
                }
            } else if (hierarchyLevel === 2) {
                // Signal Processing - Resistors/Capacitors (Team Leads)
                return {
                    card: 'bg-blue-100 border-2 border-blue-600 rounded-sm shadow-md',
                    border: 'border-blue-600',
                    text: 'text-gray-900',
                    role: 'text-blue-800 font-semibold',
                    avatar: 'bg-blue-200 border-2 border-blue-400',
                    avatarIcon: 'text-blue-600',
                    isCircuit: true,
                    symbolType: 'processor'
                }
            } else {
                // Output - LEDs/Load (Staff)
                return {
                    card: 'bg-green-100 border-2 border-green-600 rounded-sm shadow-md',
                    border: 'border-green-600',
                    text: 'text-gray-900',
                    role: 'text-green-800 font-medium',
                    avatar: 'bg-green-200 border-2 border-green-400',
                    avatarIcon: 'text-green-600',
                    isCircuit: true,
                    symbolType: 'output'
                }
            }
        }

        // MECHANICAL DIAGRAM STYLE - Clean alignment, equal sizing, structural clarity
        const getMechanicalCardStyle = () => {
            // All levels have consistent sizing - focus on layout and alignment
            const baseStyle = {
                card: 'bg-white border-2 rounded-lg shadow-md',
                text: 'text-gray-900',
                avatar: 'bg-gray-100 border-2',
                avatarIcon: 'text-gray-600',
                isMechanical: true
            }
            
            if (hierarchyLevel === 0) {
                // Main Assembly - Larger, primary color
                return {
                    ...baseStyle,
                    card: 'bg-gradient-to-br from-indigo-50 to-white border-3 border-indigo-500 rounded-lg shadow-xl',
                    border: 'border-indigo-500',
                    role: 'text-indigo-700 font-bold uppercase tracking-wide',
                    avatar: 'bg-indigo-100 border-2 border-indigo-400',
                    avatarIcon: 'text-indigo-600'
                }
            } else if (hierarchyLevel === 1) {
                // Sub-Assembly - Secondary color
                return {
                    ...baseStyle,
                    card: 'bg-gradient-to-br from-purple-50 to-white border-2 border-purple-400 rounded-lg shadow-lg',
                    border: 'border-purple-400',
                    role: 'text-purple-700 font-semibold uppercase',
                    avatar: 'bg-purple-100 border-2 border-purple-300',
                    avatarIcon: 'text-purple-600'
                }
            } else if (hierarchyLevel === 2) {
                // Component Group
                return {
                    ...baseStyle,
                    card: 'bg-gradient-to-br from-violet-50 to-white border-2 border-violet-300 rounded-lg shadow-md',
                    border: 'border-violet-300',
                    role: 'text-violet-700 font-medium',
                    avatar: 'bg-violet-100 border-2 border-violet-200',
                    avatarIcon: 'text-violet-600'
                }
            } else {
                // Individual Parts
                return {
                    ...baseStyle,
                    card: 'bg-gradient-to-br from-gray-50 to-white border-2 border-gray-300 rounded-lg shadow-sm',
                    border: 'border-gray-300',
                    role: 'text-gray-600',
                    avatar: 'bg-gray-100 border-2 border-gray-200',
                    avatarIcon: 'text-gray-500'
                }
            }
        }

        // PHOTO ORG CHART - Emphasizes profile photos with circular frames
        const getPhotoCardStyle = () => {
            if (hierarchyLevel === 0) {
                return {
                    card: 'bg-white border-3 border-amber-500 rounded-2xl shadow-xl',
                    border: 'border-amber-500',
                    text: 'text-gray-900 font-bold',
                    role: 'text-amber-700 font-semibold',
                    avatar: 'bg-gradient-to-br from-amber-100 to-amber-200 border-4 border-amber-400',
                    avatarIcon: 'text-amber-600',
                    isPhoto: true
                }
            } else if (hierarchyLevel === 1) {
                return {
                    card: 'bg-white border-2 border-sky-400 rounded-2xl shadow-lg',
                    border: 'border-sky-400',
                    text: 'text-gray-900 font-semibold',
                    role: 'text-sky-600 font-medium',
                    avatar: 'bg-gradient-to-br from-sky-100 to-sky-200 border-3 border-sky-300',
                    avatarIcon: 'text-sky-600',
                    isPhoto: true
                }
            } else {
                return {
                    card: 'bg-white border-2 border-emerald-300 rounded-2xl shadow-md',
                    border: 'border-emerald-300',
                    text: 'text-gray-800',
                    role: 'text-emerald-600',
                    avatar: 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-200',
                    avatarIcon: 'text-emerald-500',
                    isPhoto: true
                }
            }
        }

        // HORIZONTAL ORG CHART - Optimized for left-to-right flow
        const getHorizontalCardStyle = () => {
            if (hierarchyLevel === 0) {
                return {
                    card: 'bg-gradient-to-r from-rose-500 to-pink-500 border-2 border-rose-600 rounded-xl shadow-xl',
                    border: 'border-rose-600',
                    text: 'text-white font-bold',
                    role: 'text-rose-100 font-semibold uppercase tracking-wide',
                    avatar: 'bg-white border-3 border-white',
                    avatarIcon: 'text-rose-500',
                    isHorizontal: true
                }
            } else if (hierarchyLevel === 1) {
                return {
                    card: 'bg-gradient-to-r from-fuchsia-400 to-purple-400 border-2 border-fuchsia-500 rounded-xl shadow-lg',
                    border: 'border-fuchsia-500',
                    text: 'text-white font-semibold',
                    role: 'text-fuchsia-100 font-medium',
                    avatar: 'bg-white border-2 border-white',
                    avatarIcon: 'text-fuchsia-500',
                    isHorizontal: true
                }
            } else {
                return {
                    card: 'bg-gradient-to-r from-violet-300 to-purple-300 border-2 border-violet-400 rounded-xl shadow-md',
                    border: 'border-violet-400',
                    text: 'text-gray-800 font-medium',
                    role: 'text-violet-700',
                    avatar: 'bg-white border-2 border-violet-200',
                    avatarIcon: 'text-violet-500',
                    isHorizontal: true
                }
            }
        }

        // COMPANY ORG CHART - Professional corporate look
        const getCompanyCardStyle = () => {
            if (hierarchyLevel === 0) {
                // CEO / Executive
                return {
                    card: 'bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-slate-600 rounded-lg shadow-2xl',
                    border: 'border-slate-600',
                    text: 'text-white font-bold',
                    role: 'text-amber-400 font-semibold uppercase tracking-wider',
                    avatar: 'bg-amber-400 border-3 border-amber-300',
                    avatarIcon: 'text-slate-800'
                }
            } else if (hierarchyLevel === 1) {
                // Department Heads
                return {
                    card: 'bg-gradient-to-b from-slate-600 to-slate-700 border-2 border-slate-500 rounded-lg shadow-xl',
                    border: 'border-slate-500',
                    text: 'text-white font-semibold',
                    role: 'text-slate-200 font-medium uppercase',
                    avatar: 'bg-white border-2 border-slate-300',
                    avatarIcon: 'text-slate-600'
                }
            } else if (hierarchyLevel === 2) {
                // Managers
                return {
                    card: 'bg-white border-2 border-slate-300 rounded-lg shadow-lg',
                    border: 'border-slate-300',
                    text: 'text-slate-800 font-semibold',
                    role: 'text-slate-600 font-medium',
                    avatar: 'bg-slate-100 border-2 border-slate-200',
                    avatarIcon: 'text-slate-500'
                }
            } else {
                // Staff
                return {
                    card: 'bg-slate-50 border border-slate-200 rounded-lg shadow-md',
                    border: 'border-slate-200',
                    text: 'text-slate-700',
                    role: 'text-slate-500',
                    avatar: 'bg-slate-100 border border-slate-200',
                    avatarIcon: 'text-slate-400'
                }
            }
        }

        // NON-PROFIT ORG CHART - Warm, mission-focused colors
        const getNonProfitCardStyle = () => {
            if (hierarchyLevel === 0) {
                // Board of Directors
                return {
                    card: 'bg-gradient-to-b from-emerald-600 to-emerald-700 border-3 border-emerald-500 rounded-xl shadow-xl',
                    border: 'border-emerald-500',
                    text: 'text-white font-bold',
                    role: 'text-emerald-100 font-semibold uppercase',
                    avatar: 'bg-white border-3 border-emerald-300',
                    avatarIcon: 'text-emerald-600'
                }
            } else if (hierarchyLevel === 1) {
                // Executive Director
                return {
                    card: 'bg-gradient-to-b from-teal-500 to-teal-600 border-2 border-teal-400 rounded-xl shadow-lg',
                    border: 'border-teal-400',
                    text: 'text-white font-semibold',
                    role: 'text-teal-100 font-medium',
                    avatar: 'bg-white border-2 border-teal-200',
                    avatarIcon: 'text-teal-600'
                }
            } else if (hierarchyLevel === 2) {
                // Program Teams
                return {
                    card: 'bg-gradient-to-b from-cyan-100 to-cyan-200 border-2 border-cyan-300 rounded-xl shadow-md',
                    border: 'border-cyan-300',
                    text: 'text-teal-800 font-medium',
                    role: 'text-teal-600',
                    avatar: 'bg-white border-2 border-cyan-200',
                    avatarIcon: 'text-cyan-600'
                }
            } else {
                // Volunteers
                return {
                    card: 'bg-white border-2 border-emerald-200 rounded-xl shadow-sm',
                    border: 'border-emerald-200',
                    text: 'text-teal-700',
                    role: 'text-emerald-500',
                    avatar: 'bg-emerald-50 border border-emerald-200',
                    avatarIcon: 'text-emerald-400'
                }
            }
        }

        // CORPORATE ORG CHART - Enterprise-level formal structure
        const getCorporateCardStyle = () => {
            if (hierarchyLevel === 0) {
                // CEO / Board
                return {
                    card: 'bg-gradient-to-b from-zinc-900 to-black border-2 border-amber-500 rounded-lg shadow-2xl',
                    border: 'border-amber-500',
                    text: 'text-white font-bold',
                    role: 'text-amber-400 font-bold uppercase tracking-widest',
                    avatar: 'bg-amber-500 border-4 border-amber-400',
                    avatarIcon: 'text-zinc-900',
                    headerBg: '#18181b'
                }
            } else if (hierarchyLevel === 1) {
                // C-Suite / VPs
                return {
                    card: 'bg-gradient-to-b from-zinc-700 to-zinc-800 border-2 border-zinc-500 rounded-lg shadow-xl',
                    border: 'border-zinc-500',
                    text: 'text-white font-semibold',
                    role: 'text-zinc-300 font-medium uppercase tracking-wide',
                    avatar: 'bg-zinc-300 border-3 border-zinc-200',
                    avatarIcon: 'text-zinc-700'
                }
            } else if (hierarchyLevel === 2) {
                // Directors
                return {
                    card: 'bg-zinc-100 border-2 border-zinc-400 rounded-lg shadow-lg',
                    border: 'border-zinc-400',
                    text: 'text-zinc-800 font-semibold',
                    role: 'text-zinc-600 font-medium uppercase',
                    avatar: 'bg-zinc-200 border-2 border-zinc-300',
                    avatarIcon: 'text-zinc-600'
                }
            } else if (hierarchyLevel === 3) {
                // Managers
                return {
                    card: 'bg-white border-2 border-zinc-300 rounded-lg shadow-md',
                    border: 'border-zinc-300',
                    text: 'text-zinc-700 font-medium',
                    role: 'text-zinc-500',
                    avatar: 'bg-zinc-100 border border-zinc-200',
                    avatarIcon: 'text-zinc-500'
                }
            } else {
                // Staff
                return {
                    card: 'bg-zinc-50 border border-zinc-200 rounded-lg shadow-sm',
                    border: 'border-zinc-200',
                    text: 'text-zinc-600',
                    role: 'text-zinc-400',
                    avatar: 'bg-zinc-100 border border-zinc-200',
                    avatarIcon: 'text-zinc-400'
                }
            }
        }

        // HOSPITAL ORG CHART - Healthcare-focused with clinical colors
        const getHospitalCardStyle = () => {
            if (hierarchyLevel === 0) {
                // Medical Director / CEO
                return {
                    card: 'bg-gradient-to-b from-blue-700 to-blue-800 border-3 border-blue-500 rounded-xl shadow-2xl',
                    border: 'border-blue-500',
                    text: 'text-white font-bold',
                    role: 'text-blue-100 font-bold uppercase tracking-wide',
                    avatar: 'bg-white border-4 border-blue-300',
                    avatarIcon: 'text-blue-700'
                }
            } else if (hierarchyLevel === 1) {
                // Doctors / Department Chiefs
                return {
                    card: 'bg-gradient-to-b from-sky-500 to-sky-600 border-2 border-sky-400 rounded-xl shadow-xl',
                    border: 'border-sky-400',
                    text: 'text-white font-semibold',
                    role: 'text-sky-100 font-medium uppercase',
                    avatar: 'bg-white border-3 border-sky-200',
                    avatarIcon: 'text-sky-600'
                }
            } else if (hierarchyLevel === 2) {
                // Nurses / Team Leads
                return {
                    card: 'bg-gradient-to-b from-teal-100 to-teal-200 border-2 border-teal-300 rounded-xl shadow-lg',
                    border: 'border-teal-300',
                    text: 'text-teal-800 font-semibold',
                    role: 'text-teal-600 font-medium',
                    avatar: 'bg-white border-2 border-teal-200',
                    avatarIcon: 'text-teal-600'
                }
            } else {
                // Administrative Staff
                return {
                    card: 'bg-white border-2 border-blue-200 rounded-xl shadow-md',
                    border: 'border-blue-200',
                    text: 'text-blue-800',
                    role: 'text-blue-500',
                    avatar: 'bg-blue-50 border border-blue-200',
                    avatarIcon: 'text-blue-400'
                }
            }
        }

        // HR DEPARTMENT ORG CHART - People-focused warm colors
        const getHRCardStyle = () => {
            if (hierarchyLevel === 0) {
                // HR Director
                return {
                    card: 'bg-gradient-to-b from-orange-500 to-orange-600 border-3 border-orange-400 rounded-xl shadow-xl',
                    border: 'border-orange-400',
                    text: 'text-white font-bold',
                    role: 'text-orange-100 font-semibold uppercase',
                    avatar: 'bg-white border-3 border-orange-200',
                    avatarIcon: 'text-orange-600'
                }
            } else if (hierarchyLevel === 1) {
                // HR Managers (Recruitment, Payroll, Training)
                return {
                    card: 'bg-gradient-to-b from-amber-400 to-amber-500 border-2 border-amber-300 rounded-xl shadow-lg',
                    border: 'border-amber-300',
                    text: 'text-amber-900 font-semibold',
                    role: 'text-amber-800 font-medium',
                    avatar: 'bg-white border-2 border-amber-200',
                    avatarIcon: 'text-amber-600'
                }
            } else {
                // HR Staff
                return {
                    card: 'bg-gradient-to-b from-yellow-50 to-yellow-100 border-2 border-yellow-300 rounded-xl shadow-md',
                    border: 'border-yellow-300',
                    text: 'text-amber-800',
                    role: 'text-amber-600',
                    avatar: 'bg-white border border-yellow-200',
                    avatarIcon: 'text-amber-500'
                }
            }
        }

        // SCHOOL ORG CHART - Education-focused with academic colors
        const getSchoolCardStyle = () => {
            if (hierarchyLevel === 0) {
                // Principal
                return {
                    card: 'bg-gradient-to-b from-indigo-700 to-indigo-800 border-3 border-indigo-500 rounded-xl shadow-2xl',
                    border: 'border-indigo-500',
                    text: 'text-white font-bold',
                    role: 'text-indigo-100 font-bold uppercase tracking-wide',
                    avatar: 'bg-amber-400 border-4 border-amber-300',
                    avatarIcon: 'text-indigo-800',
                    isHorizontal: true
                }
            } else if (hierarchyLevel === 1) {
                // Vice Principal / Department Heads
                return {
                    card: 'bg-gradient-to-b from-indigo-500 to-indigo-600 border-2 border-indigo-400 rounded-xl shadow-xl',
                    border: 'border-indigo-400',
                    text: 'text-white font-semibold',
                    role: 'text-indigo-100 font-medium uppercase',
                    avatar: 'bg-white border-3 border-indigo-200',
                    avatarIcon: 'text-indigo-600',
                    isHorizontal: true
                }
            } else if (hierarchyLevel === 2) {
                // Teachers
                return {
                    card: 'bg-gradient-to-b from-blue-100 to-blue-200 border-2 border-blue-300 rounded-xl shadow-lg',
                    border: 'border-blue-300',
                    text: 'text-indigo-800 font-semibold',
                    role: 'text-indigo-600 font-medium',
                    avatar: 'bg-white border-2 border-blue-200',
                    avatarIcon: 'text-blue-600',
                    isHorizontal: true
                }
            } else {
                // Administrative Staff
                return {
                    card: 'bg-white border-2 border-indigo-200 rounded-xl shadow-md',
                    border: 'border-indigo-200',
                    text: 'text-indigo-700',
                    role: 'text-indigo-500',
                    avatar: 'bg-indigo-50 border border-indigo-200',
                    avatarIcon: 'text-indigo-400',
                    isHorizontal: true
                }
            }
        }

        // Get the actual style classes to use
        const getCardStyle = (): {
            card: string;
            border: string;
            text: string;
            role: string;
            avatar: string;
            avatarIcon?: string;
            headerBg?: string;
            avatarBorderGradient?: string;
        } => {
            if (chartStyle === 'minimal') {
                return getMinimalCardStyle()
            }
            if (chartStyle === 'classic') {
                return getClassicCardStyle()
            }
            if (chartStyle === 'colorful') {
                return getColorfulCardStyle()
            }
            if (chartStyle === 'professional') {
                return getProfessionalCardStyle()
            }
            if (chartStyle === 'twolevel') {
                return getTwoLevelCardStyle()
            }
            if (chartStyle === 'threelevel') {
                return getThreeLevelCardStyle()
            }
            if (chartStyle === 'fourlevel') {
                return getFourLevelCardStyle()
            }
            if (chartStyle === 'colorcoded') {
                return getColorCodedCardStyle()
            }
            if (chartStyle === 'wiring') {
                return getWiringCardStyle()
            }
            if (chartStyle === 'pid') {
                return getPidCardStyle()
            }
            if (chartStyle === 'circuit') {
                return getCircuitCardStyle()
            }
            if (chartStyle === 'mechanical') {
                return getMechanicalCardStyle()
            }
            // New organization chart types
            if (chartStyle === 'photo') {
                return getPhotoCardStyle()
            }
            if (chartStyle === 'horizontal') {
                return getHorizontalCardStyle()
            }
            if (chartStyle === 'company') {
                return getCompanyCardStyle()
            }
            if (chartStyle === 'nonprofit') {
                return getNonProfitCardStyle()
            }
            if (chartStyle === 'corporate') {
                return getCorporateCardStyle()
            }
            if (chartStyle === 'hospital') {
                return getHospitalCardStyle()
            }
            if (chartStyle === 'hr') {
                return getHRCardStyle()
            }
            if (chartStyle === 'school') {
                return getSchoolCardStyle()
            }
            // Modern style or default
            return {
                card: styleClasses.card,
                border: styleClasses.border,
                text: styleClasses.text,
                role: styleClasses.role,
                avatar: styleClasses.avatar,
                avatarIcon: styleClasses.avatarIcon || 'text-white',
                headerBg: styleClasses.headerBg,
                avatarBorderGradient: undefined
            }
        }

        const cardStyle = getCardStyle()

        // Get ring color based on style - extract color from border class
        const getRingColor = () => {
            if (chartStyle === 'classic') {
                if (hierarchyLevel === 0) return 'ring-blue-400'
                if (hierarchyLevel === 1) return 'ring-orange-400'
                if (hierarchyLevel === 2 || hierarchyLevel === 3) return 'ring-blue-400'
                return 'ring-green-400'
            }
            if (chartStyle === 'minimal') {
                if (hierarchyLevel === 0) return 'ring-red-400'
                if (hierarchyLevel === 1) return 'ring-blue-400'
                return 'ring-yellow-400'
            }
            if (chartStyle === 'colorful') {
                if (hierarchyLevel === 0) return 'ring-red-400'
                if (hierarchyLevel === 1) return 'ring-purple-400'
                return 'ring-yellow-400'
            }
            if (chartStyle === 'professional') return 'ring-gray-400'
            if (chartStyle === 'twolevel') return 'ring-gray-300'
            if (chartStyle === 'threelevel') return 'ring-gray-300'
            if (chartStyle === 'fourlevel') return 'ring-gray-300'
            if (chartStyle === 'colorcoded') {
                if (hierarchyLevel === 0 || hierarchyLevel === 2) return 'ring-blue-400'
                if (hierarchyLevel === 1 || hierarchyLevel === 3) return 'ring-green-400'
                return 'ring-orange-400'
            }
            // New diagram types
            if (chartStyle === 'wiring') {
                if (hierarchyLevel === 0) return 'ring-red-500'
                if (hierarchyLevel === 1) return 'ring-blue-500'
                return 'ring-green-500'
            }
            if (chartStyle === 'pid') {
                if (hierarchyLevel === 0) return 'ring-slate-400'
                if (hierarchyLevel === 1) return 'ring-cyan-400'
                return 'ring-teal-400'
            }
            if (chartStyle === 'circuit') {
                if (hierarchyLevel === 0) return 'ring-yellow-500'
                if (hierarchyLevel === 1) return 'ring-gray-500'
                if (hierarchyLevel === 2) return 'ring-blue-500'
                return 'ring-green-500'
            }
            if (chartStyle === 'mechanical') {
                if (hierarchyLevel === 0) return 'ring-indigo-400'
                if (hierarchyLevel === 1) return 'ring-purple-400'
                if (hierarchyLevel === 2) return 'ring-violet-400'
                return 'ring-gray-400'
            }
            // New organization chart types
            if (chartStyle === 'photo') {
                if (hierarchyLevel === 0) return 'ring-amber-400'
                if (hierarchyLevel === 1) return 'ring-sky-400'
                return 'ring-emerald-400'
            }
            if (chartStyle === 'horizontal') {
                if (hierarchyLevel === 0) return 'ring-rose-400'
                if (hierarchyLevel === 1) return 'ring-fuchsia-400'
                return 'ring-violet-400'
            }
            if (chartStyle === 'company') {
                if (hierarchyLevel === 0) return 'ring-amber-400'
                if (hierarchyLevel === 1) return 'ring-slate-400'
                return 'ring-slate-300'
            }
            if (chartStyle === 'nonprofit') {
                if (hierarchyLevel === 0) return 'ring-emerald-400'
                if (hierarchyLevel === 1) return 'ring-teal-400'
                return 'ring-cyan-400'
            }
            if (chartStyle === 'corporate') {
                if (hierarchyLevel === 0) return 'ring-amber-400'
                if (hierarchyLevel === 1) return 'ring-zinc-400'
                return 'ring-zinc-300'
            }
            if (chartStyle === 'hospital') {
                if (hierarchyLevel === 0) return 'ring-blue-500'
                if (hierarchyLevel === 1) return 'ring-sky-400'
                return 'ring-teal-400'
            }
            if (chartStyle === 'hr') {
                if (hierarchyLevel === 0) return 'ring-orange-400'
                if (hierarchyLevel === 1) return 'ring-amber-400'
                return 'ring-yellow-400'
            }
            if (chartStyle === 'school') {
                if (hierarchyLevel === 0) return 'ring-indigo-500'
                if (hierarchyLevel === 1) return 'ring-indigo-400'
                return 'ring-blue-400'
            }
            return 'ring-blue-400' // modern
        }

        // Get button color based on style
        const getButtonColor = () => {
            if (chartStyle === 'classic') {
                if (hierarchyLevel === 0) return 'bg-blue-900 hover:bg-blue-950'
                if (hierarchyLevel === 1) return 'bg-orange-600 hover:bg-orange-700'
                if (hierarchyLevel === 2 || hierarchyLevel === 3) return 'bg-blue-600 hover:bg-blue-700'
                return 'bg-green-600 hover:bg-green-700'
            }
            if (chartStyle === 'minimal') {
                if (hierarchyLevel === 0) return 'bg-red-700 hover:bg-red-800'
                if (hierarchyLevel === 1) return 'bg-blue-600 hover:bg-blue-700'
                return 'bg-yellow-500 hover:bg-yellow-600'
            }
            if (chartStyle === 'colorful') {
                if (hierarchyLevel === 0) return 'bg-red-700 hover:bg-red-800'
                if (hierarchyLevel === 1) return 'bg-purple-700 hover:bg-purple-800'
                return 'bg-orange-500 hover:bg-orange-600'
            }
            if (chartStyle === 'professional') return 'bg-gray-600 hover:bg-gray-700'
            if (chartStyle === 'twolevel') return 'bg-gray-400 hover:bg-gray-500'
            if (chartStyle === 'threelevel') return 'bg-gray-400 hover:bg-gray-500'
            if (chartStyle === 'fourlevel') return 'bg-gray-400 hover:bg-gray-500'
            if (chartStyle === 'colorcoded') {
                if (hierarchyLevel === 0 || hierarchyLevel === 2) return 'bg-blue-700 hover:bg-blue-800'
                if (hierarchyLevel === 1 || hierarchyLevel === 3) return 'bg-green-700 hover:bg-green-800'
                return 'bg-orange-600 hover:bg-orange-700'
            }
            // New diagram types
            if (chartStyle === 'wiring') {
                if (hierarchyLevel === 0) return 'bg-red-600 hover:bg-red-700'
                if (hierarchyLevel === 1) return 'bg-blue-600 hover:bg-blue-700'
                return 'bg-green-600 hover:bg-green-700'
            }
            if (chartStyle === 'pid') {
                if (hierarchyLevel === 0) return 'bg-slate-600 hover:bg-slate-700'
                if (hierarchyLevel === 1) return 'bg-cyan-600 hover:bg-cyan-700'
                return 'bg-teal-600 hover:bg-teal-700'
            }
            if (chartStyle === 'circuit') {
                if (hierarchyLevel === 0) return 'bg-yellow-600 hover:bg-yellow-700'
                if (hierarchyLevel === 1) return 'bg-gray-600 hover:bg-gray-700'
                if (hierarchyLevel === 2) return 'bg-blue-600 hover:bg-blue-700'
                return 'bg-green-600 hover:bg-green-700'
            }
            if (chartStyle === 'mechanical') {
                if (hierarchyLevel === 0) return 'bg-indigo-600 hover:bg-indigo-700'
                if (hierarchyLevel === 1) return 'bg-purple-600 hover:bg-purple-700'
                if (hierarchyLevel === 2) return 'bg-violet-600 hover:bg-violet-700'
                return 'bg-gray-600 hover:bg-gray-700'
            }
            // New organization chart types
            if (chartStyle === 'photo') {
                if (hierarchyLevel === 0) return 'bg-amber-500 hover:bg-amber-600'
                if (hierarchyLevel === 1) return 'bg-sky-500 hover:bg-sky-600'
                return 'bg-emerald-500 hover:bg-emerald-600'
            }
            if (chartStyle === 'horizontal') {
                if (hierarchyLevel === 0) return 'bg-rose-500 hover:bg-rose-600'
                if (hierarchyLevel === 1) return 'bg-fuchsia-500 hover:bg-fuchsia-600'
                return 'bg-violet-500 hover:bg-violet-600'
            }
            if (chartStyle === 'company') {
                if (hierarchyLevel === 0) return 'bg-slate-700 hover:bg-slate-800'
                if (hierarchyLevel === 1) return 'bg-slate-600 hover:bg-slate-700'
                return 'bg-slate-500 hover:bg-slate-600'
            }
            if (chartStyle === 'nonprofit') {
                if (hierarchyLevel === 0) return 'bg-emerald-600 hover:bg-emerald-700'
                if (hierarchyLevel === 1) return 'bg-teal-600 hover:bg-teal-700'
                return 'bg-cyan-600 hover:bg-cyan-700'
            }
            if (chartStyle === 'corporate') {
                if (hierarchyLevel === 0) return 'bg-zinc-800 hover:bg-zinc-900'
                if (hierarchyLevel === 1) return 'bg-zinc-600 hover:bg-zinc-700'
                return 'bg-zinc-500 hover:bg-zinc-600'
            }
            if (chartStyle === 'hospital') {
                if (hierarchyLevel === 0) return 'bg-blue-700 hover:bg-blue-800'
                if (hierarchyLevel === 1) return 'bg-sky-600 hover:bg-sky-700'
                return 'bg-teal-600 hover:bg-teal-700'
            }
            if (chartStyle === 'hr') {
                if (hierarchyLevel === 0) return 'bg-orange-500 hover:bg-orange-600'
                if (hierarchyLevel === 1) return 'bg-amber-500 hover:bg-amber-600'
                return 'bg-yellow-500 hover:bg-yellow-600'
            }
            if (chartStyle === 'school') {
                if (hierarchyLevel === 0) return 'bg-indigo-700 hover:bg-indigo-800'
                if (hierarchyLevel === 1) return 'bg-indigo-600 hover:bg-indigo-700'
                return 'bg-blue-600 hover:bg-blue-700'
            }
            return 'bg-blue-600 hover:bg-blue-700' // modern
        }

        // Get drag over background color
        const getDragOverBg = () => {
            if (chartStyle === 'classic') {
                if (hierarchyLevel === 0) return 'bg-blue-900'
                if (hierarchyLevel === 1) return 'bg-orange-600'
                if (hierarchyLevel === 2 || hierarchyLevel === 3) return 'bg-blue-600'
                return 'bg-green-600'
            }
            if (chartStyle === 'minimal') {
                if (hierarchyLevel === 0) return 'bg-red-700'
                if (hierarchyLevel === 1) return 'bg-blue-600'
                return 'bg-yellow-500'
            }
            if (chartStyle === 'colorful') {
                return 'bg-transparent'
            }
            if (chartStyle === 'professional') return 'bg-gray-700'
            if (chartStyle === 'twolevel') return 'bg-gray-200'
            if (chartStyle === 'threelevel') return 'bg-gray-200'
            if (chartStyle === 'fourlevel') return 'bg-gray-200'
            if (chartStyle === 'colorcoded') {
                if (hierarchyLevel === 0 || hierarchyLevel === 2) return 'bg-blue-700'
                if (hierarchyLevel === 1 || hierarchyLevel === 3) return 'bg-green-700'
                return 'bg-orange-600'
            }
            // New diagram types
            if (chartStyle === 'wiring') {
                if (hierarchyLevel === 0) return 'bg-red-100'
                if (hierarchyLevel === 1) return 'bg-blue-100'
                return 'bg-green-100'
            }
            if (chartStyle === 'pid') {
                if (hierarchyLevel === 0) return 'bg-slate-200'
                if (hierarchyLevel === 1) return 'bg-cyan-100'
                return 'bg-teal-100'
            }
            if (chartStyle === 'circuit') {
                if (hierarchyLevel === 0) return 'bg-yellow-200'
                if (hierarchyLevel === 1) return 'bg-gray-200'
                if (hierarchyLevel === 2) return 'bg-blue-100'
                return 'bg-green-100'
            }
            if (chartStyle === 'mechanical') {
                if (hierarchyLevel === 0) return 'bg-indigo-100'
                if (hierarchyLevel === 1) return 'bg-purple-100'
                if (hierarchyLevel === 2) return 'bg-violet-100'
                return 'bg-gray-100'
            }
            // New organization chart types
            if (chartStyle === 'photo') {
                if (hierarchyLevel === 0) return 'bg-amber-100'
                if (hierarchyLevel === 1) return 'bg-sky-100'
                return 'bg-emerald-100'
            }
            if (chartStyle === 'horizontal') {
                if (hierarchyLevel === 0) return 'bg-rose-100'
                if (hierarchyLevel === 1) return 'bg-fuchsia-100'
                return 'bg-violet-100'
            }
            if (chartStyle === 'company') {
                if (hierarchyLevel === 0) return 'bg-slate-200'
                if (hierarchyLevel === 1) return 'bg-slate-100'
                return 'bg-slate-50'
            }
            if (chartStyle === 'nonprofit') {
                if (hierarchyLevel === 0) return 'bg-emerald-100'
                if (hierarchyLevel === 1) return 'bg-teal-100'
                return 'bg-cyan-100'
            }
            if (chartStyle === 'corporate') {
                if (hierarchyLevel === 0) return 'bg-zinc-200'
                if (hierarchyLevel === 1) return 'bg-zinc-100'
                return 'bg-zinc-50'
            }
            if (chartStyle === 'hospital') {
                if (hierarchyLevel === 0) return 'bg-blue-100'
                if (hierarchyLevel === 1) return 'bg-sky-100'
                return 'bg-teal-100'
            }
            if (chartStyle === 'hr') {
                if (hierarchyLevel === 0) return 'bg-orange-100'
                if (hierarchyLevel === 1) return 'bg-amber-100'
                return 'bg-yellow-100'
            }
            if (chartStyle === 'school') {
                if (hierarchyLevel === 0) return 'bg-indigo-100'
                if (hierarchyLevel === 1) return 'bg-indigo-50'
                return 'bg-blue-100'
            }
            if (chartStyle === 'modern') return 'bg-blue-100'
            return 'bg-blue-50' // default
        }

        // Get drag over border color
        const getDragOverBorder = () => {
            if (chartStyle === 'classic') {
                if (hierarchyLevel === 0) return 'border-blue-950'
                if (hierarchyLevel === 1) return 'border-orange-700'
                if (hierarchyLevel === 2 || hierarchyLevel === 3) return 'border-blue-700'
                return 'border-green-700'
            }
            if (chartStyle === 'minimal') {
                if (hierarchyLevel === 0) return 'border-red-800'
                if (hierarchyLevel === 1) return 'border-blue-700'
                return 'border-yellow-600'
            }
            if (chartStyle === 'colorful') {
                if (hierarchyLevel === 0) return 'border-red-600'
                if (hierarchyLevel === 1) return 'border-purple-600'
                return 'border-orange-500'
            }
            if (chartStyle === 'professional') return 'border-gray-600'
            // New diagram types
            if (chartStyle === 'wiring') {
                if (hierarchyLevel === 0) return 'border-red-700'
                if (hierarchyLevel === 1) return 'border-blue-700'
                return 'border-green-700'
            }
            if (chartStyle === 'pid') {
                if (hierarchyLevel === 0) return 'border-slate-600'
                if (hierarchyLevel === 1) return 'border-cyan-500'
                return 'border-teal-400'
            }
            if (chartStyle === 'circuit') {
                if (hierarchyLevel === 0) return 'border-yellow-700'
                if (hierarchyLevel === 1) return 'border-gray-800'
                if (hierarchyLevel === 2) return 'border-blue-700'
                return 'border-green-700'
            }
            if (chartStyle === 'mechanical') {
                if (hierarchyLevel === 0) return 'border-indigo-600'
                if (hierarchyLevel === 1) return 'border-purple-500'
                if (hierarchyLevel === 2) return 'border-violet-400'
                return 'border-gray-400'
            }
            // New organization chart types
            if (chartStyle === 'photo') {
                if (hierarchyLevel === 0) return 'border-amber-600'
                if (hierarchyLevel === 1) return 'border-sky-500'
                return 'border-emerald-500'
            }
            if (chartStyle === 'horizontal') {
                if (hierarchyLevel === 0) return 'border-rose-600'
                if (hierarchyLevel === 1) return 'border-fuchsia-600'
                return 'border-violet-500'
            }
            if (chartStyle === 'company') {
                if (hierarchyLevel === 0) return 'border-slate-700'
                if (hierarchyLevel === 1) return 'border-slate-600'
                return 'border-slate-400'
            }
            if (chartStyle === 'nonprofit') {
                if (hierarchyLevel === 0) return 'border-emerald-600'
                if (hierarchyLevel === 1) return 'border-teal-500'
                return 'border-cyan-500'
            }
            if (chartStyle === 'corporate') {
                if (hierarchyLevel === 0) return 'border-amber-600'
                if (hierarchyLevel === 1) return 'border-zinc-600'
                return 'border-zinc-400'
            }
            if (chartStyle === 'hospital') {
                if (hierarchyLevel === 0) return 'border-blue-700'
                if (hierarchyLevel === 1) return 'border-sky-600'
                return 'border-teal-500'
            }
            if (chartStyle === 'hr') {
                if (hierarchyLevel === 0) return 'border-orange-600'
                if (hierarchyLevel === 1) return 'border-amber-500'
                return 'border-yellow-500'
            }
            if (chartStyle === 'school') {
                if (hierarchyLevel === 0) return 'border-indigo-700'
                if (hierarchyLevel === 1) return 'border-indigo-600'
                return 'border-blue-500'
            }
            return 'border-blue-600' // modern
        }

        return (
            <div
                draggable={true}
                onDragStart={(e) => handleDragStart(e, member.id)}
                onDragOver={(e) => handleDragOver(e, member.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, member.id)}
                onMouseDown={(e) => handleMemberMouseDown(e, member.id)}
                className={`absolute cursor-move z-10 transition-all ${isDragging ? 'opacity-70 scale-105 z-20' : ''
                    } ${isDragOver ? `ring-4 ${getRingColor()} ring-offset-2 scale-105` : ''}`}
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    transform: isDragging ? 'scale(1.05)' : isDragOver ? 'scale(1.05)' : 'scale(1)',
                    userSelect: 'none'
                }}
            >
                <div className={`${cardStyle.card} flex flex-col items-center text-center min-w-[180px] max-w-[220px] ${isDragOver ? `${getDragOverBorder()} ${getDragOverBg()}` : cardStyle.border} relative group overflow-hidden rounded-lg shadow-md`}>
                    {/* Modern Style - Two-tone Design */}
                    {chartStyle === 'modern' && cardStyle.headerBg ? (
                        <>
                            {/* Top Section - Dark Blue with Role */}
                            <div
                                className="w-full px-4 py-2.5 text-center"
                                style={{ backgroundColor: cardStyle.headerBg }}
                            >
                                <div className={`font-bold ${cardStyle.role} text-sm uppercase leading-tight truncate`}>
                                    {member.role || '[Designation]'}
                                </div>
                            </div>

                            {/* Bottom Section - White with Avatar and Name (Horizontal Layout) */}
                            <div className="w-full bg-white px-4 py-3 flex items-center gap-3">
                                {/* Avatar - Left Side, Overlapping Top Section */}
                                <div className="flex-shrink-0 relative -mt-6">
                                    {member.photo ? (
                                        <div className="relative">
                                            <img
                                                src={member.photo}
                                                alt={member.name || 'Member'}
                                                className="w-14 h-14 rounded-full object-cover border-2 border-white"
                                            />
                                            <label className={`absolute -bottom-1 -right-1 ${getButtonColor()} text-white rounded-full p-1 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity`}>
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        if (e.target.files[0]) {
                                                            handleMemberPhotoUpload(member.id, e.target.files[0])
                                                        }
                                                        e.target.value = ''
                                                    }}
                                                    className="hidden"
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </label>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    updateMember(member.id, 'photo', null)
                                                }}
                                                className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="Remove photo"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <div className={`w-14 h-14 rounded-full ${cardStyle.avatar} flex items-center justify-center border-2 border-white`}>
                                                <svg className={`w-8 h-8 ${cardStyle.avatarIcon}`} fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                                </svg>
                                            </div>
                                            <label className={`absolute -bottom-1 -right-1 ${getButtonColor()} text-white rounded-full p-1 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity`} title="Add photo (optional)">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        if (e.target.files[0]) {
                                                            handleMemberPhotoUpload(member.id, e.target.files[0])
                                                        }
                                                        e.target.value = ''
                                                    }}
                                                    className="hidden"
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </label>
                                        </div>
                                    )}
                                </div>

                                {/* Name - Right Side */}
                                <div className="flex-1 min-w-0 text-left">
                                    <div className={`${cardStyle.text} text-sm font-medium leading-tight truncate`}>
                                        {member.name || '[Name]'}
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : chartStyle === 'professional' && cardStyle.headerBg ? (
                        <div
                            className="w-full px-4 py-3 text-center"
                            style={{ backgroundColor: cardStyle.headerBg }}
                        >
                            <div className={`font-bold ${cardStyle.role} text-sm uppercase leading-tight mb-1 truncate`}>
                                {member.role || '[Designation]'}
                            </div>
                            <div className={`${cardStyle.text} text-xs leading-tight truncate`}>
                                {member.name || '[Name]'}
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Photo or Generic Avatar - Top Center (Other Styles) */}
                            <div className="flex-shrink-0 relative mb-3 p-4">
                                {member.photo ? (
                                    <div className="relative">
                                        {/* Gradient Border Wrapper for Colorful Style */}
                                        {chartStyle === 'colorful' && cardStyle.avatarBorderGradient ? (
                                            <div className={`p-1 rounded-full bg-gradient-to-br ${cardStyle.avatarBorderGradient}`}>
                                                <img
                                                    src={member.photo}
                                                    alt={member.name || 'Member'}
                                                    className="w-16 h-16 rounded-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <img
                                                src={member.photo}
                                                alt={member.name || 'Member'}
                                                className={`w-16 h-16 rounded-full object-cover border-2 ${chartStyle === 'professional' || chartStyle === 'classic'
                                                        ? 'border-white'
                                                        : chartStyle === 'minimal'
                                                            ? (hierarchyLevel >= 2 ? 'border-gray-900' : 'border-white')
                                                            : cardStyle.border
                                                    }`}
                                            />
                                        )}
                                        <label className={`absolute -bottom-1 -right-1 ${getButtonColor()} text-white rounded-full p-1 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity`}>
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    if (e.target.files[0]) {
                                                        handleMemberPhotoUpload(member.id, e.target.files[0])
                                                    }
                                                    e.target.value = ''
                                                }}
                                                className="hidden"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </label>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                updateMember(member.id, 'photo', null)
                                            }}
                                            className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Remove photo"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        {/* Generic Avatar Icon */}
                                        {chartStyle === 'colorful' && cardStyle.avatarBorderGradient ? (
                                            <div className={`p-1 rounded-full bg-gradient-to-br ${cardStyle.avatarBorderGradient}`}>
                                                <div className={`w-16 h-16 rounded-full ${cardStyle.avatar} flex items-center justify-center`}>
                                                    <svg className={`w-9 h-9 ${cardStyle.avatarIcon}`} fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className={`w-16 h-16 rounded-full ${cardStyle.avatar} flex items-center justify-center border-2 ${chartStyle === 'professional' || chartStyle === 'classic'
                                                    ? 'border-white'
                                                    : chartStyle === 'minimal'
                                                        ? (hierarchyLevel >= 2 ? 'border-gray-900' : 'border-white')
                                                        : cardStyle.border
                                                }`}>
                                                <svg className={`w-9 h-9 ${cardStyle.avatarIcon}`} fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                                </svg>
                                            </div>
                                        )}
                                        <label className={`absolute -bottom-1 -right-1 ${getButtonColor()} text-white rounded-full p-1 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity`} title="Add photo (optional)">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    if (e.target.files[0]) {
                                                        handleMemberPhotoUpload(member.id, e.target.files[0])
                                                    }
                                                    e.target.value = ''
                                                }}
                                                className="hidden"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </label>
                                    </div>
                                )}
                            </div>

                            {/* Text Content - Below Photo (Other Styles) */}
                            <div className="flex-1 w-full min-w-0 px-4">
                                <div className={`font-bold ${cardStyle.role} text-sm uppercase leading-tight mb-1 truncate`}>
                                    {member.role || '[Designation]'}
                                </div>
                                <div className={`${cardStyle.text} text-xs leading-tight mb-2 truncate`}>
                                    {member.name || '[Name]'}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Photo or Generic Avatar - Below Name/Role (Professional Style) */}
                    {chartStyle === 'professional' && (
                        <div className="flex-shrink-0 relative mb-3 px-4 pt-4">
                            {member.photo ? (
                                <div className="relative">
                                    <img
                                        src={member.photo}
                                        alt={member.name || 'Member'}
                                        className="w-16 h-16 rounded-full object-cover border-2 border-white"
                                    />
                                    <label className={`absolute -bottom-1 -right-1 ${getButtonColor()} text-white rounded-full p-1 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity`}>
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                if (e.target.files[0]) {
                                                    handleMemberPhotoUpload(member.id, e.target.files[0])
                                                }
                                                e.target.value = ''
                                            }}
                                            className="hidden"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </label>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            updateMember(member.id, 'photo', null)
                                        }}
                                        className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Remove photo"
                                    >
                                        ×
                                    </button>
                                </div>
                            ) : (
                                <div className="relative">
                                    <div className={`w-16 h-16 rounded-full ${cardStyle.avatar} flex items-center justify-center border-2 border-white`}>
                                        <svg className={`w-9 h-9 ${cardStyle.avatarIcon}`} fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                        </svg>
                                    </div>
                                    <label className={`absolute -bottom-1 -right-1 ${getButtonColor()} text-white rounded-full p-1 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity`} title="Add photo (optional)">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                if (e.target.files[0]) {
                                                    handleMemberPhotoUpload(member.id, e.target.files[0])
                                                }
                                                e.target.value = ''
                                            }}
                                            className="hidden"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </label>
                                </div>
                            )}
                        </div>
                    )}
                    {/* Show contact info for minimal, colorful, and professional styles */}
                    {(chartStyle === 'minimal' || chartStyle === 'colorful' || chartStyle === 'professional') && (
                        <div className={`w-full space-y-1.5 ${chartStyle === 'professional' ? 'px-4 pb-4 pt-2 border-t border-gray-600' : 'px-4 mt-2 pt-2 border-t border-opacity-20'}`}>
                            {member.phone && (
                                <div className={`flex items-center gap-1.5 ${cardStyle.text} text-[10px] leading-tight truncate`}>
                                    {chartStyle === 'professional' && (
                                        <svg className="w-3 h-3 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    )}
                                    <span>{member.phone}</span>
                                </div>
                            )}
                            {member.email && (
                                <div className={`flex items-center gap-1.5 ${cardStyle.text} text-[10px] leading-tight truncate`}>
                                    {chartStyle === 'professional' && (
                                        <svg className="w-3 h-3 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    )}
                                    <span>{member.email}</span>
                                </div>
                            )}
                            {(!member.phone && !member.email) && (
                                <>
                                    <div className={`${cardStyle.text} text-[10px] leading-tight truncate`}>
                                        {member.phone || '[Phone]'}
                                    </div>
                                    <div className={`${cardStyle.text} text-[10px] leading-tight truncate`}>
                                        {member.email || '[Email]'}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Remove Button - Hidden by default, shown on hover */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            removeMember(member.id)
                        }}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100"
                        title="Remove member"
                    >
                        ×
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 sm:p-6 lg:p-8 xl:p-10">
            {/* Main Content */}
            <div className="w-full max-w-[1920px] mx-auto">
                {/* Page Header */}
                <div className="mb-6 lg:mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-2">
                                Organization Chart
                            </h1>
                            <p className="text-sm lg:text-base text-gray-600">
                                Create and manage your organizational hierarchy structure.
                            </p>
                        </div>
                        <div className="flex gap-3 flex-wrap">
                            <label className="px-4 lg:px-6 py-2 lg:py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-md hover:shadow-lg flex items-center gap-2 text-sm lg:text-base cursor-pointer">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Upload Chart Image
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleChartImageUpload}
                                    className="hidden"
                                />
                            </label>
                            {chartImage && (
                                <button
                                    onClick={removeChartImage}
                                    className="px-4 lg:px-6 py-2 lg:py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors shadow-md hover:shadow-lg flex items-center gap-2 text-sm lg:text-base"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Remove Image
                                </button>
                            )}
                            <button
                                onClick={handleDownloadPNG}
                                className="px-4 lg:px-6 py-2 lg:py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg flex items-center gap-2 text-sm lg:text-base"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download PNG
                            </button>
                            <button
                                onClick={handleDownloadPDF}
                                className="px-4 lg:px-6 py-2 lg:py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg flex items-center gap-2 text-sm lg:text-base"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                Download PDF
                            </button>
                            <button
                                onClick={handlePrint}
                                className="px-4 lg:px-6 py-2 lg:py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-md hover:shadow-lg flex items-center gap-2 text-sm lg:text-base"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                </svg>
                                Print
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Left Sidebar - Chart Settings and Member Management */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Chart Settings Panel - Moved to top */}
                        <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-md border-2 border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Chart Settings</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Style Selection */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Chart Style</label>
                                    <select
                                        value={chartStyle}
                                        onChange={(e) => setChartStyle(e.target.value)}
                                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                                    >
                                        <optgroup label="Basic Styles">
                                            <option value="modern">Modern</option>
                                            <option value="classic">Classic</option>
                                            <option value="minimal">Minimal</option>
                                            <option value="colorful">Colorful</option>
                                            <option value="professional">Professional</option>
                                        </optgroup>
                                        <optgroup label="Hierarchy Levels">
                                            <option value="twolevel">Org Chart (2 Level)</option>
                                            <option value="threelevel">Org Chart (3 Level)</option>
                                            <option value="fourlevel">Org Chart (4 Level)</option>
                                            <option value="colorcoded">Color-Coded Hierarchy</option>
                                        </optgroup>
                                        <optgroup label="Special Features">
                                            <option value="photo">Photo Org Chart</option>
                                            <option value="horizontal">Horizontal Org Chart</option>
                                        </optgroup>
                                        <optgroup label="Industry Templates">
                                            <option value="company">Company Org Chart</option>
                                            <option value="corporate">Corporate Org Chart</option>
                                            <option value="nonprofit">Non-Profit Org Chart</option>
                                            <option value="hospital">Hospital Org Chart</option>
                                            <option value="hr">HR Department Chart</option>
                                            <option value="school">School Org Chart</option>
                                        </optgroup>
                                        <optgroup label="Engineering Diagrams">
                                            <option value="wiring">Wiring Diagram</option>
                                            <option value="pid">P&ID (Process Flow)</option>
                                            <option value="circuit">Circuit Diagram</option>
                                            <option value="mechanical">Mechanical Layout</option>
                                        </optgroup>
                                    </select>
                                </div>

                                {/* Paper Size Selection */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Paper Size</label>
                                    <select
                                        value={paperSize}
                                        onChange={(e) => setPaperSize(e.target.value)}
                                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                                    >
                                        <option value="A4">A4</option>
                                        <option value="A3">A3</option>
                                        <option value="Legal">Legal</option>
                                    </select>
                                </div>

                                {/* Orientation Selection */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Orientation</label>
                                    <select
                                        value={orientation}
                                        onChange={(e) => setOrientation(e.target.value)}
                                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                                    >
                                        <option value="portrait">Portrait</option>
                                        <option value="landscape">Landscape</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-4 text-xs text-gray-500">
                                <p>Current size: {getPaperDimensions().width} × {getPaperDimensions().height} px ({paperSize} - {orientation})</p>
                            </div>
                        </div>

                        {/* Member Management Panel */}
                        <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-md border-2 border-gray-200">
                            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">Member Management</h2>
                            <p className="text-sm text-gray-600 mb-6">
                                Add members with <span className="font-semibold">name, designation, and contact number</span>. Photo is optional.
                            </p>

                            {/* Import From Data Card */}
                            <div className="mb-6 bg-white rounded-xl border-2 border-gray-200 shadow-sm overflow-hidden">
                                {/* Icon Section */}
                                <div className="p-6 flex items-center justify-center" style={{ minHeight: '180px' }}>
                                    <div className="relative w-full max-w-xs">
                                        {/* Database Icon */}
                                        <div className="absolute left-0 top-0">
                                            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                                            </svg>
                                        </div>
                                        
                                        {/* Arrow */}
                                        <div className="absolute left-20 top-6">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                                            </svg>
                                        </div>
                                        
                                        {/* Hierarchical Chart Icon */}
                                        <div className="absolute right-0 top-8">
                                            <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                                                {/* Top rectangle */}
                                                <rect x="10" y="1" width="4" height="4" rx="0.5" />
                                                {/* Middle rectangles */}
                                                <rect x="5" y="8" width="4" height="4" rx="0.5" />
                                                <rect x="15" y="8" width="4" height="4" rx="0.5" />
                                                {/* Bottom rectangles */}
                                                <rect x="2" y="15" width="3.5" height="4" rx="0.5" />
                                                <rect x="8.5" y="15" width="3.5" height="4" rx="0.5" />
                                                <rect x="18.5" y="15" width="3.5" height="4" rx="0.5" />
                                                {/* Connection lines */}
                                                <line x1="12" y1="5" x2="7" y2="8" strokeWidth="1.5" />
                                                <line x1="12" y1="5" x2="17" y2="8" strokeWidth="1.5" />
                                                <line x1="7" y1="12" x2="3.75" y2="15" strokeWidth="1.5" />
                                                <line x1="7" y1="12" x2="10.25" y2="15" strokeWidth="1.5" />
                                                <line x1="17" y1="12" x2="20.25" y2="15" strokeWidth="1.5" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Button Section */}
                                <label className="block cursor-pointer">
                                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-4 text-center hover:from-yellow-500 hover:to-orange-600 transition-all">
                                        <span className="text-gray-900 font-semibold text-sm lg:text-base">Import From Data</span>
                                    </div>
                                    <input
                                        type="file"
                                        accept=".json,.csv,.txt"
                                        onChange={handleImportFromData}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Organization Members</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-600">{orgMembers.length} members</span>
                                        <button
                                            onClick={addMember}
                                            className="w-8 h-8 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                                            title="Add new member"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                {orgMembers.length > 0 && (
                                    <div className="space-y-2 max-h-96 overflow-y-auto">
                                        {orgMembers.map((member) => (
                                            <div key={member.id} className="p-3 border-2 border-gray-200 rounded-lg">
                                                {/* Photo Upload - Optional */}
                                                <div className="mb-3 flex flex-col items-center">
                                                    {member.photo ? (
                                                        <div className="relative">
                                                            <img
                                                                src={member.photo}
                                                                alt={member.name || 'Member'}
                                                                className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                                                            />
                                                            <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 cursor-pointer hover:bg-blue-700">
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                </svg>
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={(e) => {
                                                                        if (e.target.files[0]) {
                                                                            handleMemberPhotoUpload(member.id, e.target.files[0])
                                                                        }
                                                                        e.target.value = ''
                                                                    }}
                                                                    className="hidden"
                                                                />
                                                            </label>
                                                            <button
                                                                onClick={() => updateMember(member.id, 'photo', null)}
                                                                className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
                                                                title="Remove photo"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="relative">
                                                            <div className={`w-16 h-16 rounded-full ${getStyleClasses().avatar} flex items-center justify-center`}>
                                                                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                                                </svg>
                                                            </div>
                                                            <label className="absolute bottom-0 right-0 bg-gray-600 text-white rounded-full p-1 cursor-pointer hover:bg-gray-700" title="Add photo (optional)">
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                                </svg>
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={(e) => {
                                                                        if (e.target.files[0]) {
                                                                            handleMemberPhotoUpload(member.id, e.target.files[0])
                                                                        }
                                                                        e.target.value = ''
                                                                    }}
                                                                    className="hidden"
                                                                />
                                                            </label>
                                                        </div>
                                                    )}
                                                    <p className="text-xs text-gray-500 mt-1">Photo (Optional)</p>
                                                </div>

                                                {/* Required Fields */}
                                                <div className="space-y-2">
                                                    <div>
                                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Name *</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Enter name"
                                                            value={member.name}
                                                            onChange={(e) => updateMember(member.id, 'name', e.target.value)}
                                                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Designation *</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Enter designation/role"
                                                            value={member.role}
                                                            onChange={(e) => updateMember(member.id, 'role', e.target.value)}
                                                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Contact Number *</label>
                                                        <input
                                                            type="tel"
                                                            placeholder="Enter contact number"
                                                            value={member.phone}
                                                            onChange={(e) => updateMember(member.id, 'phone', e.target.value)}
                                                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Email (Optional)</label>
                                                        <input
                                                            type="email"
                                                            placeholder="Enter email"
                                                            value={member.email}
                                                            onChange={(e) => updateMember(member.id, 'email', e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Reports To</label>
                                                        <select
                                                            value={member.parentId || ''}
                                                            onChange={(e) => updateMember(member.id, 'parentId', e.target.value || null)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                                                        >
                                                            <option value="">No Parent (Top Level)</option>
                                                            {orgMembers.filter(m => m.id !== member.id).map(parent => (
                                                                <option key={parent.id} value={parent.id}>
                                                                    {parent.name || parent.role || `Member ${parent.id}`}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <button
                                                        onClick={() => removeMember(member.id)}
                                                        className="w-full px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition-colors"
                                                    >
                                                        Remove Member
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Organization Chart Preview */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-md border-2 border-blue-500">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Organization Chart</h2>
                                <div className="text-sm text-gray-600">
                                    <p className="mb-1">💡 Drag members to reposition</p>
                                    <p>Hold Alt/Option + drag to link members</p>
                                </div>
                            </div>

                            {orgMembers.length === 0 ? (
                                <div
                                    ref={chartContainerRef}
                                    className="relative bg-gray-50 rounded-lg overflow-auto mx-auto border-2 border-gray-300"
                                    style={{
                                        width: `${Math.min(getPaperDimensions().width, 1200)}px`,
                                        height: `${Math.min(getPaperDimensions().height, 800)}px`,
                                        maxWidth: '100%',
                                        aspectRatio: `${getPaperDimensions().width} / ${getPaperDimensions().height}`
                                    }}
                                >
                                    {/* Background Organization Chart Image */}
                                    {chartImage ? (
                                        <div className="absolute inset-0 z-0">
                                            <img
                                                src={chartImage}
                                                alt="Organization Chart Background"
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 absolute inset-0 flex flex-col items-center justify-center">
                                            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            <p className="text-gray-500 text-lg mb-4">No organization members yet</p>
                                            <p className="text-gray-400 text-sm">Add members to start building your organization chart</p>
                                            <p className="text-gray-400 text-sm mt-2">Or upload an organization chart image above</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div
                                    ref={chartContainerRef}
                                    className="relative bg-gray-50 rounded-lg overflow-auto mx-auto border-2 border-gray-300"
                                    style={{
                                        width: `${Math.min(getPaperDimensions().width, 1200)}px`,
                                        height: `${Math.min(getPaperDimensions().height, 800)}px`,
                                        maxWidth: '100%',
                                        aspectRatio: `${getPaperDimensions().width} / ${getPaperDimensions().height}`
                                    }}
                                    onDragOver={(e) => {
                                        e.preventDefault()
                                        e.dataTransfer.dropEffect = 'move'
                                    }}
                                    onDrop={(e) => {
                                        e.preventDefault()
                                        setDraggedMember(null)
                                        setDragOverMember(null)
                                    }}
                                >
                                    {/* Background Organization Chart Image */}
                                    {chartImage && (
                                        <div className="absolute inset-0 z-0">
                                            <img
                                                src={chartImage}
                                                alt="Organization Chart Background"
                                                className="w-full h-full object-contain"
                                                style={{ opacity: 0.3 }}
                                            />
                                        </div>
                                    )}

                                    {/* Render all members as draggable cards */}
                                    {orgMembers.map((member) => (
                                        <DraggableMemberCard key={member.id} member={member} />
                                    ))}

                                    {/* Connection lines from parents to children */}
                                    {orgMembers.map((member) => {
                                        if (member.parentId) {
                                            return drawConnection(member.parentId, member.id)
                                        }
                                        return null
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrganizationChart

